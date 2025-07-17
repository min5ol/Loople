import React, { useState, useEffect } from "react";
import { signup } from "../../services/userService";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/defaults";
import { parseAddress } from "../../utils/parseAddress";
import { searchKakaoAddress } from "../../services/kakaoService";
import ProfileImageUploader from "../organisms/ProfileImageUploader";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    gpsLat: "",
    gpsLng: "",
    dong_code: "",
    sido: "",
    sigungu: "",
    eupmyun: "",
    ri: "",
    profileImageUrl: null,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (url) => {
    console.log("✅ 이미지 업로드 완료:", url);
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.jibunAddress || data.roadAddress;
        if (!fullAddress) return alert("주소를 선택해 주세요.");

        try {
          const res = await searchKakaoAddress(fullAddress);
          const result = res.documents?.[0];
          if (!result) return alert("주소 검색 결과가 없습니다.");

          const { sido, sigungu, eupmyun, ri } = parseAddress(result.address);
          const { data } = await axios.get("http://localhost:8080/api/v2/beopjeongdong/dong-code", {
            params: { sido, sigungu, eupmyun, ri },
          });

          setFormData((prev) => ({
            ...prev,
            address: fullAddress,
            gpsLat: result.y,
            gpsLng: result.x,
            sido,
            sigungu,
            eupmyun,
            ri,
            dong_code: data.dongCode,
          }));
        } catch (err) {
          console.error("❌ 주소 처리 중 오류", err);
          alert("주소 처리에 실패했습니다.");
        }
      },
    }).open();
  };

  const simulatePASS = () => {
    const fakePhone = `010-1234-${Math.floor(1000 + Math.random() * 9000)}`;
    alert("PASS 인증 시뮬레이션");
    setFormData((prev) => ({ ...prev, name: "홍길동", phone: fakePhone }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 제출 데이터:", formData);

    const required = [
      "email", "password", "nickname", "name", "phone",
      "address", "detailAddress", "gpsLat", "gpsLng",
      "sido", "sigungu", "eupmyun", "dong_code"
    ];

    for (let key of required) {
      if (!formData[key]) {
        alert(`${key}은(는) 필수입니다.`);
        return;
      }
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname,
      name: formData.name,
      phone: formData.phone,
      detailAddress: formData.detailAddress,
      profileImageUrl: formData.profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL,
      sido: formData.sido,
      sigungu: formData.sigungu,
      eupmyun: formData.eupmyun,
      ri: formData.ri || "",
    };

    try {
      await signup(payload);
      alert("🎉 회원가입 성공!");
    } catch (err) {
      console.error("❌ 회원가입 실패", err);
      alert("회원가입 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <ProfileImageUploader onUpload={handleUpload} />

      <input name="email" placeholder="이메일" value={formData.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} />
      <input name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} />
      <input name="name" placeholder="이름" value={formData.name} onChange={handleChange} />
      <input name="phone" placeholder="휴대폰번호" value={formData.phone} onChange={handleChange} />

      <button type="button" onClick={simulatePASS}>PASS 인증 시뮬</button>
      <button type="button" onClick={handleAddressSearch}>주소 검색</button>

      <input name="address" placeholder="주소" value={formData.address} readOnly />
      <input name="detailAddress" placeholder="상세주소" value={formData.detailAddress} onChange={handleChange} />

      <button type="submit">회원가입</button>
    </form>
  );
}
