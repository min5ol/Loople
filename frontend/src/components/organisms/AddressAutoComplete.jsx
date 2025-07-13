import React, { useState, useEffect } from "react";
import axios from "axios";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export default function AddressAutoComplete({ onSelect }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 입력할 때 자동완성
  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const { data } = await axios.get("https://dapi.kakao.com/v2/local/search/keyword.json", {
          params: { query: keyword },
          headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
        });

        setResults(data.documents);
        setShowDropdown(true);
      } catch (err) {
        console.error("주소 자동완성 실패", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [keyword]);

  // 주소 선택하면 → 위도/경도/법정동코드 가져옴
  const handleSelect = async (addressName) => {
    try {
      const { data } = await axios.get("https://dapi.kakao.com/v2/local/search/address.json", {
        params: { query: addressName },
        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
      });

      const selected = data.documents[0];
      const result = {
        address: selected.address.address_name,
        gpsLat: selected.y,
        gpsLng: selected.x,
        regionCode: selected.address.b_code,
      };

      onSelect(result);
      setKeyword(result.address);
      setShowDropdown(false);
    } catch (err) {
      console.error("좌표 검색 실패", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="도로명 주소 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {showDropdown && results.length > 0 && (
        <ul style={{
          position: "absolute", background: "#fff", border: "1px solid #ccc", width: "100%", zIndex: 10
        }}>
          {results.map((item, idx) => (
            <li key={idx} onClick={() => handleSelect(item.address_name)}>
              {item.address_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}