// src/components/pages/SignUpStep2.jsx

/**
 * 작성일: 2025.07.18
 * 수정일: 2025.08.12
 * 설명: 회원가입 2단계 - 소셜/일반 분기 + Zustand 사용
 *  - 소셜 유입: Step1 스킵, OAuthCallback에서 저장한 socialData로 통과
 *  - 새로고침 보호: sessionStorage에서 socialData 폴백 복구
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkNickname } from "../../apis/user";
import { useSignupStore } from "../../store/signupStore";

export default function SignUpStep2() {
  const navigate = useNavigate();

  // Zustand 스토어
  const { step1Data, socialData, setStep2Data, setSocialData } = useSignupStore();

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    phone: "",
  });

  const [nicknameStatus, setNicknameStatus] = useState({
    checked: false,
    message: "",
    isValid: false,
  });

  // 가드: 소셜이거나(콜백에서 주입) 로컬 1단계를 통과했는지 확인
  useEffect(() => {
    // 1) 소셜(Zustand) 또는 로컬(step1)이 있으면 통과
    if (socialData?.provider || step1Data?.email) return;

    // 2) 새로고침 등으로 스토어가 날아간 경우, sessionStorage에서 복구
    const ssProvider = sessionStorage.getItem("provider");
    const ssEmail = sessionStorage.getItem("email");
    const ssSocialId = sessionStorage.getItem("socialId");
    if (ssProvider && ssEmail) {
      setSocialData({ provider: ssProvider, email: ssEmail, socialId: ssSocialId || "" });
      return;
    }

    // 3) 둘 다 없으면 Step1로
    alert("1단계를 먼저 진행해주세요.");
    navigate("/signup");
  }, [step1Data, socialData, navigate, setSocialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "nickname") {
      setNicknameStatus({ checked: false, message: "", isValid: false });
    }
  };

  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) {
      setNicknameStatus({
        checked: false,
        message: "닉네임을 입력해주세요.",
        isValid: false,
      });
      return;
    }

    try {
      const res = await checkNickname(form.nickname);
      setNicknameStatus({
        checked: true,
        message: res.available
          ? "✅ 사용 가능한 닉네임입니다."
          : "❌ 이미 사용 중인 닉네임입니다.",
        isValid: res.available,
      });
    } catch (e) {
      console.error("[닉네임 중복확인] 실패", e);
      setNicknameStatus({
        checked: true,
        message: "오류가 발생했습니다. 다시 시도해주세요.",
        isValid: false,
      });
    }
  };

  const simulatePASS = () => {
    const fakePhone = `010-1234-${Math.floor(1000 + Math.random() * 9000)}`;
    alert("PASS 인증 시뮬레이션 완료!");
    setForm((prev) => ({ ...prev, name: "홍길동", phone: fakePhone }));
  };

  const handleNext = () => {
    const { name, nickname, phone } = form;

    if (!name.trim() || !nickname.trim() || !phone.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (!nicknameStatus.checked || !nicknameStatus.isValid) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    // Zustand에 저장(다음 단계에서 사용)
    setStep2Data(form);

    navigate("/signup/step3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-w-ground font-ptd-400">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl box-border">
        <h2 className="text-2xl font-ptd-700 mb-8 text-b-ground">기본 정보를 입력해주세요</h2>

        <div className="space-y-5">
          <input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />

          <div className="flex gap-2">
            <input
              name="nickname"
              placeholder="닉네임"
              value={form.nickname}
              onChange={handleChange}
              className="flex-1 h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              className="w-[100px] h-12 px-2 rounded-lg bg-primary-light text-white font-ptd-500 hover:bg-[#68b76a] transition-all border-none shadow-inner"
            >
              중복 확인
            </button>
          </div>

          {nicknameStatus.message && (
            <p className={`text-sm px-1 ${nicknameStatus.isValid ? "text-green-600" : "text-red-500"}`}>
              {nicknameStatus.message}
            </p>
          )}

          <input
            name="phone"
            placeholder="휴대폰번호"
            value={form.phone}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />

          <button
            onClick={simulatePASS}
            className="w-full h-12 bg-primary-light text-white rounded-lg hover:bg-secondary font-ptd-500 border-none shadow-inner"
          >
            PASS 인증 시뮬레이션
          </button>
        </div>

        <button
          onClick={handleNext}
          className="w-full h-12 mt-8 bg-primary text-white rounded-lg hover:bg-[#2f7b4d] transition font-ptd-600 border-none shadow-inner"
        >
          다음
        </button>
      </div>
    </div>
  );
}
