// 작성일: 2025.07.15
// 작성자: 장민솔
// 설명: 사용자가 주소 입력하면 카카오 API로 자동완성 목록 보여주고 항목 선택 시 주소+좌표+법정동코드까지 부모 컴포넌트로 넘김

import React, { useState, useEffect } from "react";
import axios from "axios";

// 카카오 REST API키는 .env 파일에서 가져옴
const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export default function AddressAutoComplete({ onSelect }) {
  const [keyword, setKeyword] = useState(""); // 사용자가 입력 중인 키워드
  const [results, setResults] = useState([]); // 자동완성 결과 목록
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 보여줄지 여부

  // 입력이 바뀔 때마다 자동완성 요청 (300ms)
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

        setResults(data.documents); // 자동완성된 주소 목록 저장
        setShowDropdown(true); // 목록 열기
      } catch (err) {
        console.error("주소 자동완성 실패", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300); // 입력 멈춘 뒤 300ms 후 실행
    return () => clearTimeout(debounce); // 이전 요청 취소
  }, [keyword]);

  // 자동 완성 항목 클릭 시 실제 주소 상세 데이터 받아옴
  const handleSelect = async (addressName) => {
    try {
      const { data } = await axios.get("https://dapi.kakao.com/v2/local/search/address.json", {
        params: { query: addressName },
        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
      });

      const selected = data.documents[0]; // 첫 번째 결과만 사용
      const result = {
        address: selected.address.address_name, // 전체 주소
        gpsLat: selected.y, // 위도
        gpsLng: selected.x, // 경도
        regionCode: selected.address.b_code, // 법정동코드
      };

      onSelect(result); // 부모 컴포넌트에 전달
      setKeyword(result.address); // input 값도 선택한 주소로 바꿈
      setShowDropdown(false); // 드롭다운 닫기
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

      {/* 결과가 있으면 드롭다운 띄움 */}
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