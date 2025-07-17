import React, { useState, useEffect } from "react";
import { signup } from "../../services/userService";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/defaults";
import { parseAddress } from "../../utils/parseAddress";
import { searchKakaoAddress } from "../../services/kakaoService";
import ProfileImageUploader from "../organisms/ProfileImageUploader";
import SignupSuccessModal from "../atoms/SignupSuccessModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

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
      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ 회원가입 실패", err);
      alert("회원가입 실패");
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate("/onboarding");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-4"
      >
        <h2 className="text-center text-xl font-bold mb-2">회원가입</h2>

        <div className="flex flex-col items-center gap-2">
          <img
            src={formData.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
            alt="프로필 미리보기"
            className="w-24 h-24 rounded-full border object-cover"
          />
          <ProfileImageUploader onUpload={handleUpload} />
        </div>

        <input
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          placeholder="휴대폰번호"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <button type="button" onClick={simulatePASS} className="flex-1 bg-gray-200 rounded p-2">
            PASS 인증 시뮬
          </button>
          <button type="button" onClick={handleAddressSearch} className="flex-1 bg-gray-200 rounded p-2">
            주소 검색
          </button>
        </div>

        <input
          name="address"
          placeholder="주소"
          value={formData.address}
          readOnly
          className="w-full border p-2 rounded bg-gray-50"
        />
        <input
          name="detailAddress"
          placeholder="상세주소"
          value={formData.detailAddress}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded"
        >
          회원가입
        </button>
      </form>

      {showSuccessModal && (
        <SignupSuccessModal
          nickname={formData.nickname}
          onClose={handleSuccessConfirm}
        />
      )}
    </>
  );
}
