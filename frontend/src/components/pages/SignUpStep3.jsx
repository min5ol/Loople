// 작성일: 2025.07.16
// 작성자: 장민솔
// 설명: 회원가입 3단계. 주소 검색을 통해 행정구역 코드(dong_code)까지 받아오고 상세주소 + 프로필 이미지 포함해서 최종 회원가입 API 요청 보냄.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import instance from "../../apis/instance";
import { searchKakaoAddress } from "../../services/kakaoService";
import { parseAddress } from "../../utils/parseAddress";
import { signup } from "../../services/userService";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/defaults";
import { loadDaumPostcodeScript } from "../../utils/loadDaumPostcode";

import ProfileImageUploader from "../organisms/ProfileImageUploader";

export default function SignUpStep3() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    detailAddress: "",
    gpsLat: "",
    gpsLng: "",
    sido: "",
    sigungu: "",
    eupmyun: "",
    ri: "",
    dong_code: "",
    profileImageUrl: null,
  });

  // 1~2단계 없이 들어오면 막음
  useEffect(() => {
    const step1 = sessionStorage.getItem("signupStep1");
    const step2 = sessionStorage.getItem("signupStep2");
    if (!step1 || !step2) {
      alert("이전 단계를 먼저 진행해주세요.");
      navigate("/signup");
    }
  }, [navigate]);

  // 프로필 이미지 업로드 완료 시 콜백
  const handleUpload = (url) => {
    setForm((prev) => ({ ...prev, profileImageUrl: url }));
  };

  // 주소 검색 (다음 우편번호 → 카카오 → 법정동 코드 조회)
  const handleAddressSearch = async () => {
    try {
      await loadDaumPostcodeScript(); // 스크립트 동적 로드

      new window.daum.Postcode({
        oncomplete: async (data) => {
          const fullAddress = data.jibunAddress || data.roadAddress;
          if (!fullAddress) return;

          try {
            const res = await searchKakaoAddress(fullAddress); // 위경도 포함 주소 조회
            const result = res.documents?.[0];
            if (!result) return alert("주소 검색 결과가 없습니다.");

            const { sido, sigungu, eupmyun, ri } = parseAddress(result.address); // 행정구역 단위 분해
            const { data } = await instance.get("/beopjeongdong/dong-code", {
              params: { sido, sigungu, eupmyun, ri },
            });

            // form 상태 업데이트
            setForm((prev) => ({
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
            console.error("주소 처리 오류", err);
            alert("주소 처리에 실패했습니다.");
          }
        },
      }).open();
    } catch (err) {
      console.error("주소 스크립트 로딩 실패", err);
      alert("주소 검색 기능을 불러오는 데 실패했습니다.");
    }
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 회원가입 최종 제출
  const handleSubmit = async () => {
    const step1 = JSON.parse(sessionStorage.getItem("signupStep1"));
    const step2 = JSON.parse(sessionStorage.getItem("signupStep2"));

    if (!form.address || !form.detailAddress || !form.gpsLat || !form.dong_code) {
      alert("주소 및 상세정보를 입력해주세요.");
      return;
    }

    const payload = {
      ...step1,
      ...step2,
      detailAddress: form.detailAddress,
      profileImageUrl: form.profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL,
      sido: form.sido,
      sigungu: form.sigungu,
      eupmyun: form.eupmyun,
      ri: form.ri || "",
    };

    try {
      await signup(payload);           // 최종 회원가입 API 요청
      sessionStorage.clear();          // 세션 초기화
      navigate("/information");        // 가입 완료 후 온보딩 슬라이드로 이동
    } catch (err) {
      console.error("회원가입 실패", err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F6F6F6] font-[pretendard]">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-semibold text-[#264D3D]">주소 및 프로필 입력</h2>

        {/* 주소 검색 버튼 */}
        <button
          onClick={handleAddressSearch}
          className="w-full bg-[#749E89] text-white py-2 rounded hover:bg-[#264D3D] transition"
        >
          주소 검색
        </button>

        {/* 선택된 주소 (읽기 전용) */}
        <input
          name="address"
          value={form.address}
          readOnly
          className="w-full p-3 border rounded bg-gray-100"
          placeholder="선택된 주소"
        />

        {/* 상세주소 입력 */}
        <input
          name="detailAddress"
          placeholder="상세주소"
          value={form.detailAddress}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        {/* 프로필 이미지 업로더 */}
        <div className="pt-4 text-sm text-gray-600">프로필 이미지 업로드</div>
        <div className="flex items-center gap-4">
          <img
            src={form.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
            alt="프로필 미리보기"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <ProfileImageUploader onUpload={handleUpload} />
        </div>

        {/* 회원가입 완료 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-[#3C9A5F] text-white py-3 rounded hover:bg-[#2f7b4d] transition"
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}