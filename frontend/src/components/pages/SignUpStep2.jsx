// src/components/pages/SignUpStep2.jsx

/**
 * 작성일: 2025.07.18
 * 수정일: 2025.08.17
 * 설명: 회원가입 2단계 - 소셜/일반 분기 + Zustand 사용
 *  - 소셜 유입: Step1 스킵, OAuthCallback에서 저장한 socialData로 통과
 *  - 새로고침 보호: sessionStorage에서 socialData 폴백 복구
 *  - alert 제거 → 라이트 글래스 모달 도입
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { checkNickname } from "../../apis/user";
import { useSignupStore } from "../../store/signupStore";
import logo from "../../assets/brandLogo.png";

/* 경량 모달 컴포넌트 (파일 내 정의) */
function Modal({ open, title, desc, confirmLabel = "확인", onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onConfirm} />
      {/* card */}
      <div className="relative w-[92%] max-w-sm rounded-2xl p-6
                      bg-white/80 backdrop-blur-md
                      shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_10px_24px_rgba(0,0,0,0.12)]">
        <h3 className="text-lg font-ptd-700 text-brand-ink">{title}</h3>
        {desc && <p className="mt-2 text-sm text-brand-ink/70 leading-relaxed">{desc}</p>}
        <div className="mt-6 flex justify-end">
          <button
            className="ctl-btn-primary w-auto px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(60,154,95,0.35)]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignUpStep2() {
  const navigate = useNavigate();

  // Zustand 스토어 (현재 스토어 구조에 맞춤: step1Data 없음)
  const { socialData, setStep2Data, setSocialData } = useSignupStore();

  const [form, setForm] = useState({ name: "", nickname: "", phone: "" });
  const [nicknameStatus, setNicknameStatus] = useState({
    checked: false,
    message: "",
    isValid: false,
  });

  // 모달 상태
  const [modal, setModal] = useState({ open: false, title: "", desc: "", onConfirm: null });

  const openModal = useCallback((title, desc, onConfirm) => {
    setModal({ open: true, title, desc, onConfirm: onConfirm || (() => setModal((m) => ({ ...m, open: false }))) });
  }, []);
  const closeModal = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  // 가드: 소셜이거나(session) 1단계 통과했는지 확인
  useEffect(() => {
    if (socialData?.provider || sessionStorage.getItem("email")) return;

    // 소셜 폴백 복구 시도
    const ssProvider = sessionStorage.getItem("provider");
    const ssEmail = sessionStorage.getItem("email");
    const ssSocialId = sessionStorage.getItem("socialId");
    if (ssProvider && ssEmail) {
      setSocialData({ provider: ssProvider, email: ssEmail, socialId: ssSocialId || "" });
      return;
    }

    // 둘 다 없으면 모달로 안내 후 Step1로 이동
    openModal(
      "1단계를 먼저 진행해주세요",
      "이메일/비밀번호 입력 후 다음 단계로 넘어올 수 있어요.",
      () => {
        closeModal();
        navigate("/signup");
      }
    );
  }, [socialData, setSocialData, navigate, openModal, closeModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "nickname") {
      setNicknameStatus({ checked: false, message: "", isValid: false });
    }
  };

  const handleNicknameCheck = async () => {
    const nick = form.nickname.trim();
    if (!nick) {
      setNicknameStatus({ checked: false, message: "", isValid: false });
      openModal("닉네임을 입력해주세요", "공백 없이 1자 이상 입력이 필요해요.", closeModal);
      return;
    }

    try {
      const res = await checkNickname(nick);
      setNicknameStatus({
        checked: true,
        message: res.available ? "✅ 사용 가능한 닉네임입니다." : "❌ 이미 사용 중인 닉네임입니다.",
        isValid: !!res.available,
      });
      if (!res.available) {
        openModal("닉네임 중복", "다른 닉네임을 시도해 주세요.", closeModal);
      }
    } catch (e) {
      console.error("[닉네임 중복확인] 실패", e);
      setNicknameStatus({ checked: true, message: "오류가 발생했습니다. 다시 시도해주세요.", isValid: false });
      openModal("오류", "닉네임 중복 확인 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.", closeModal);
    }
  };

  const simulatePASS = () => {
    const fakePhone = `010-1234-${Math.floor(1000 + Math.random() * 9000)}`;
    setForm((prev) => ({ ...prev, name: "홍길동", phone: fakePhone }));
    openModal("PASS 인증 완료", "본인인증이 시뮬레이션으로 완료되었어요.", closeModal);
  };

  const handleNext = () => {
    const { name, nickname, phone } = form;

    if (!name.trim() || !nickname.trim() || !phone.trim()) {
      openModal("입력 값을 확인해주세요", "이름, 닉네임, 휴대폰번호를 모두 입력해야 합니다.", closeModal);
      return;
    }
    if (!nicknameStatus.checked || !nicknameStatus.isValid) {
      openModal("닉네임 중복 확인 필요", "닉네임 중복 확인 버튼을 눌러 사용 가능 여부를 확인해 주세요.", closeModal);
      return;
    }

    // Zustand에 저장(다음 단계에서 사용)
    setStep2Data(form);
    navigate("/signup/step3");
  };

  return (
    <>
      {/* 본문 */}
      <div
        className="
          min-h-screen px-6 font-ptd-400 flex items-center justify-center
          bg-brand-50
          bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]
        "
      >
        <div
          className="
            w-full max-w-md mx-auto rounded-2xl p-8
            bg-white/80 backdrop-blur-md
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]
          "
        >
          {/* 상단 진행 인디케이터 */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-brand-ink/60 mb-2">
              <span>2단계</span>
              <span className="font-ptd-600 text-brand-ink">2 / 3</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="h-2 rounded-full bg-[#7FCF9A]" />
              <div className="h-2 rounded-full bg-[#7FCF9A]" />
              <div className="h-2 rounded-full bg-brand-ink/15" />
            </div>
          </div>

          {/* 헤더: 로고 + 타이틀 */}
          <div className="text-center mb-6">
            <img src={logo} alt="Loople" className="h-12 mx-auto mb-3 drop-shadow" />
            <h2 className="text-2xl font-ptd-700 text-brand-ink">기본 정보를 입력해주세요</h2>
            <p className="text-sm text-brand-ink/60 mt-1">닉네임과 연락처를 확인하면 다음 단계로 진행돼요 ✨</p>
          </div>

          {/* 폼 */}
          <div className="space-y-5">
            {/* 이름 */}
            <input
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              className="
                ctl-input
                shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
                hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]
                transition-all
              "
            />

            {/* 닉네임 + 중복확인 */}
            <div className="flex gap-2">
              <input
                name="nickname"
                placeholder="닉네임"
                value={form.nickname}
                onChange={handleChange}
                className="
                  ctl-input flex-1
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
                  hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]
                  transition-all
                "
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                disabled={!form.nickname.trim()}
                className={`
                  ctl-btn-primary w-[112px]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.35)]
                  hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.45)]
                  transition-all
                  ${!form.nickname.trim() ? "opacity-60" : ""}
                `}
              >
                중복 확인
              </button>
            </div>

            {nicknameStatus.message && (
              <p
                className={`text-sm px-1 ${nicknameStatus.isValid ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}
                role="status"
              >
                {nicknameStatus.message}
              </p>
            )}

            {/* 휴대폰 번호 */}
            <input
              name="phone"
              placeholder="휴대폰번호"
              value={form.phone}
              onChange={handleChange}
              className="
                ctl-input
                shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
                hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]
                transition-all
              "
            />

            {/* PASS 인증 시뮬레이션 */}
            <button
              onClick={simulatePASS}
              className="
                ctl-btn-primary w-full
                bg-[#7FCF9A] hover:bg-[#3C9A5F]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(127,207,154,0.35)]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.45)]
                transition-all
                font-ptd-600
              "
            >
              PASS 인증 시뮬레이션
            </button>
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            className="
              ctl-btn-primary w-full mt-8
              shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.4)]
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.5)]
              transition-all
            "
          >
            다음
          </button>

          {/* 하단 안내 */}
          <p className="text-xs text-center text-brand-ink/50 mt-6">
            이전 단계로 돌아갈까요?{" "}
            <span
              className="text-brand-600 font-ptd-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              1단계로
            </span>
          </p>
        </div>
      </div>

      {/* 모달 */}
      <Modal
        open={modal.open}
        title={modal.title}
        desc={modal.desc}
        onConfirm={modal.onConfirm || closeModal}
      />
    </>
  );
}
