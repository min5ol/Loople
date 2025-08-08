/**
 * 작성일: 2025.07.23
 * 수정일: 2025.08.08
 * 작성자: 장민솔
 * 설명: 회원가입 3단계 - zustand 스토어 분리 적용 및 버그 수정
 */

// src/components/pages/SignUpStep3.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../store/signupStore"; // 임시 스토어
import { useAuthStore } from "../../store/authStore"; // 영구 스토어 import

import instance from "../../apis/instance";
import { searchKakaoAddress } from "../../services/kakaoService";
import { parseAddress } from "../../utils/parseAddress";
import { signup, signupSocial } from "../../services/userService";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/defaults";
import { loadDaumPostcodeScript } from "../../utils/loadDaumPostcode";

import ProfileImageUploader from "../organisms/ProfileImageUploader";
import SignupSuccessModal from "../atoms/SignupSuccessModal";

export default function SignUpStep3() {
  const navigate = useNavigate();
  
  // 각 스토어에서 필요한 상태와 함수를 가져옵니다.
  const { step1Data, step2Data, socialData } = useSignupStore();
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);

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

  const [modalOpen, setModalOpen] = useState(false);
  const [signupUserName, setSignupUserName] = useState("");
  const [signupUserId, setSignupUserId] = useState(null);

  useEffect(() => {
    // 이전 단계 데이터가 없으면 뒤로 보냅니다.
    if (!step2Data.nickname) {
      alert("이전 단계를 먼저 진행해주세요.");
      navigate("/signup");
    }
  }, [step2Data, navigate]);

  const handleUpload = (url) => {
    setForm((prev) => ({ ...prev, profileImageUrl: url }));
  };

  const handleAddressSearch = async () => {
    try {
      await loadDaumPostcodeScript();

      new window.daum.Postcode({
        oncomplete: async (data) => {
          const fullAddress = data.jibunAddress || data.roadAddress;
          if (!fullAddress) return;

          try {
            const res = await searchKakaoAddress(fullAddress);
            const result = res.documents?.[0];
            if (!result) return alert("주소 검색 결과가 없습니다.");

            const { sido, sigungu, eupmyun, ri } = parseAddress(result.address);
            const { data: dongData } = await instance.get("/beopjeongdong/dong-code", {
              params: { sido, sigungu, eupmyun, ri },
            });

            setForm((prev) => ({
              ...prev,
              address: fullAddress,
              gpsLat: result.y,
              gpsLng: result.x,
              sido,
              sigungu,
              eupmyun,
              ri,
              dong_code: dongData.dongCode,
            }));
          } catch (err) {
            console.error("주소 처리 오류", err);
            alert("주소 처리에 실패했습니다.");
          }
        },
      }).open();
    } catch (err) {
      console.error("주소 검색 로딩 실패", err);
      alert("주소 검색 기능을 불러오는 데 실패했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      address,
      detailAddress,
      gpsLat,
      dong_code,
      profileImageUrl,
      sido,
      sigungu,
      eupmyun,
      ri,
    } = form;

    if (!address || !detailAddress || !gpsLat || !dong_code) {
      alert("주소 및 상세주소를 입력해주세요.");
      return;
    }

    try {
      let payload, res;
      let finalPayload = {
        detailAddress,
        profileImageUrl: profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL,
        sido,
        sigungu,
        eupmyun,
      };

      if (ri && ri.trim() !== "") {
        finalPayload.ri = ri;
      }

      if (socialData.provider) {
        if (!socialData.email || !socialData.socialId || !step2Data.nickname || !step2Data.phone) {
          alert("소셜 사용자 정보가 누락되었습니다.");
          return;
        }
        payload = { ...finalPayload, ...socialData, ...step2Data };
        res = await signupSocial(payload);
      } else {
        payload = { ...finalPayload, ...step1Data, ...step2Data };
        res = await signup(payload);
      }

      // [핵심] API 응답 성공 후, 영구 스토어에 사용자 정보를 저장합니다.
      setAuthInfo({
        userId: res.userId,
        nickname: res.nickname,
        email: payload.email,
        token: res.token,
      });

      setSignupUserName(res.nickname);
      setSignupUserId(res.userId);
      setModalOpen(true);
    } catch (err) {
      console.error("[❌ 회원가입 실패]", err);
      alert("회원가입 중 문제가 발생했습니다.");
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    // [핵심] 여기서 reset()을 호출하지 않습니다. 버그의 원인입니다.
    // 데이터 초기화는 다음 페이지인 SignUpComplete.jsx에서 처리합니다.
    navigate(`/signup/complete?userId=${signupUserId}&name=${encodeURIComponent(signupUserName)}`);
  };

  return (
    <>
      <SignupSuccessModal
        isOpen={modalOpen}
        name={signupUserName}
        onConfirm={handleModalConfirm}
      />
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F6F6F6] font-[pretendard]">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl space-y-6 box-border">
          <h2 className="text-2xl font-semibold text-[#264D3D] text-center">프로필 및 주소 입력</h2>
          <div className="flex flex-col items-center gap-4">
            <img
              src={form.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
              alt="프로필 미리보기"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <ProfileImageUploader onUpload={handleUpload} />
          </div>
          <div className="pt-4 space-y-4">
            <button
              onClick={handleAddressSearch}
              className="w-full h-12 px-4 rounded-lg bg-primary-light text-white font-ptd-500 hover:bg-[#68b76a] transition-all border-none shadow-inner"
            >
              주소 검색
            </button>
            <input
              name="address"
              value={form.address}
              readOnly
              className="w-full h-12 px-4 rounded-lg bg-[#F0F0F0] shadow-inner font-ptd-400 box-border"
              placeholder="선택된 주소"
            />
            <input
              name="detailAddress"
              placeholder="상세주소"
              value={form.detailAddress}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg bg-[#F9F9F9] shadow-inner font-ptd-400 box-border"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full h-12 mt-6 bg-primary text-white rounded-lg hover:bg-[#2f7b4d] transition font-ptd-600 border-none shadow-inner"
          >
            회원가입 완료
          </button>
        </div>
      </div>
    </>
  );
}