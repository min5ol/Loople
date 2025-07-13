import React, { useState, useEffect } from "react";
import instance from '../../apis/instance.js';
import axios from 'axios';
import { normalizeSido } from '../../utils/normalizeAddress';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profileImageUrl: null,
    nickname: '',
    phone: '',
    address: '',
    detailAddress: '',
    gpsLat: '',
    gpsLng: '',
    regionCode: '',
    sido: '',
    sigungu: '',
    eupmyun: '',
    ri: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data: presignedUrl } = await instance.get(`/s3/presigned-url`, {
        params: {
          fileName: encodeURIComponent(file.name),
          contentType: file.type
        }
      });

      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type }
      });

      setFormData(prev => ({ ...prev, profileImageUrl: file.name }));
    } catch (err) {
      console.error("❌ 이미지 업로드 실패", err);
    }
  };

  const simulatePASS = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const fakePhone = `010-1234-${randomNum}`;
    alert("PASS 인증은 실제 환경에서만 작동합니다.\n(테스트용 정보가 자동 입력됩니다)");
    setFormData(prev => ({
      ...prev,
      name: "홍길동",
      phone: fakePhone
    }));
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.jibunAddress || data.roadAddress;
        if (!fullAddress) {
          alert("주소 정보를 불러올 수 없습니다. 다른 주소를 선택해주세요.");
          return;
        }

        try {
          const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
            params: { query: fullAddress },
            headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` }
          });

          const result = res.data.documents[0];
          if (result) {
            const {
              region_1depth_name,
              region_2depth_name,
              region_3depth_name,
              b_code
            } = result.address;

            setFormData(prev => ({
              ...prev,
              address: fullAddress,
              gpsLat: result.y,
              gpsLng: result.x,
              regionCode: b_code,
              sido: normalizeSido(region_1depth_name.trim()),
              sigungu: region_2depth_name.replace(/\s/g, ''),
              eupmyun: region_3depth_name.replace(/\s/g, ''),
              ri: null
            }));
          } else {
            alert("주소 검색 결과가 없습니다.");
          }
        } catch (error) {
          console.error("❌ 주소 검색 실패", error);
        }
      }
    }).open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const submitUserInfo = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'email', 'password', 'name', 'nickname', 'phone', 'address',
      'gpsLat', 'gpsLng', 'regionCode', 'sido', 'sigungu', 'eupmyun', 'detailAddress'
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`${field}을(를) 입력해 주세요.`);
        return;
      }
    }

    const queryParams = new URLSearchParams();
    const keys = [
      'email', 'password', 'name', 'nickname', 'phone',
      'sido', 'sigungu', 'eupmyun', 'detailAddress', 'gpsLat', 'gpsLng'
    ];
    keys.forEach(key => queryParams.append(key, formData[key]));
    queryParams.append('ri', formData.ri ?? '');

    try {
      const res = await instance.post(`/users/signup?${queryParams.toString()}`, {
        profileImageUrl: formData.profileImageUrl || null
      });

      alert("회원가입 성공");
      console.log("✅ 회원가입 성공:", res.data);
    } catch (err) {
      alert("회원가입 실패");
      console.error("🚨 회원가입 실패", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={submitUserInfo}>
        <input name="email" placeholder="이메일" value={formData.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} />
        <input name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} />
        <input name="name" placeholder="이름" value={formData.name} onChange={handleChange} />
        <input name="phone" placeholder="휴대폰번호" value={formData.phone} onChange={handleChange} />

        <button type="button" onClick={simulatePASS}>PASS 본인인증 (테스트용)</button>
        <button type="button" onClick={handleAddressSearch}>주소 검색</button>

        <input name="address" placeholder="선택된 주소" value={formData.address} readOnly />
        <input name="detailAddress" placeholder="상세주소" value={formData.detailAddress} onChange={handleChange} />
        <input type="file" name="profileImageUrl" onChange={handleFileChange} />

        <input type="submit" value="회원가입" />
      </form>
    </div>
  );
}
