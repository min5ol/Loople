import React, { useState, useEffect } from "react";
import { signup } from "../../services/userService";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/defaults";
import { normalizeSido } from "../../utils/normalizeAddress";
import ProfileImageUploader from "../organisms/ProfileImageUploader";
import { searchKakaoAddress } from "../../services/kakaoService";
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
    dong_code: "", // ✅ 백엔드에서 조회해서 채움
    sido: "",
    sigungu: "",
    eupmyun: "",
    ri: "", // optional
    profileImageUrl: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (uploadedUrl) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: uploadedUrl }));
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.jibunAddress || data.roadAddress;
        if (!fullAddress) return alert("주소를 선택해 주세요.");

        try {
          const res = await searchKakaoAddress(fullAddress);
          const result = res.documents[0];
          if (!result) return alert("주소 검색 결과가 없습니다.");

          const { region_1depth_name, region_2depth_name, region_3depth_name } = result.address;

          const sido = normalizeSido(region_1depth_name.trim());
          const sigungu = region_2depth_name.replace(/\s/g, "");
          const eupmyun = region_3depth_name.replace(/\s/g, "");
          const ri = ""; // 필요하면 향후 입력 받기

          // ✅ 동코드 조회 API 호출
          const dongRes = await axios.get("http://localhost:8080/api/v2/beopjeongdong/dong-code", {
            params: {
              sido,
              sigungu,
              eupmyun,
              ri,
            },
          });

          const dongCode = dongRes.data.dongCode;

          setFormData((prev) => ({
            ...prev,
            address: fullAddress,
            gpsLat: result.y,
            gpsLng: result.x,
            sido,
            sigungu,
            eupmyun,
            ri,
            dong_code: dongCode, // ✅ 저장
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

    const requiredFields = [
      "email", "password", "nickname", "name", "phone",
      "address", "detailAddress", "gpsLat", "gpsLng",
      "sido", "sigungu", "eupmyun", "dong_code"
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`${field}을(를) 입력해 주세요.`);
        return;
      }
    }

    const payload = {
      ...formData,
      ri: formData.ri?.trim() || null,
      profileImageUrl: formData.profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL,
    };

    console.log("🚀 회원가입 payload 전송", payload);

    try {
      await signup(payload);
      alert("회원가입 성공!");
    } catch (err) {
      console.error("❌ 회원가입 실패:", err.response?.data || err);
      alert(`회원가입 실패: ${err.response?.data?.message || "서버 오류"}`);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfileImageUploader onUpload={handleUpload} />

        <input name="email" placeholder="이메일" value={formData.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} />
        <input name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} />
        <input name="name" placeholder="이름" value={formData.name} onChange={handleChange} />
        <input name="phone" placeholder="휴대폰번호" value={formData.phone} onChange={handleChange} />

        <button type="button" onClick={simulatePASS}>PASS 본인인증 (테스트용)</button>
        <button type="button" onClick={handleAddressSearch}>주소 검색</button>

        <input name="address" placeholder="선택된 주소" value={formData.address} readOnly />
        <input name="detailAddress" placeholder="상세주소" value={formData.detailAddress} onChange={handleChange} />

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}