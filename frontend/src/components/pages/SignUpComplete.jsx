// src/components/pages/SignUpComplete.jsx
// 작성일: 2025.07.28
// 수정일: 2025.08.17
// 설명: 회원가입 완료 후 단계별 지급 슬라이드 진행 컴포넌트
//       - 마지막 완료 후 /quiz 로 이동

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSignupStore, selectSocialData } from "../../store/signupStore";
import { useAuthStore, selectAccessToken } from "../../store/authStore";
import instance from "../../apis/instance";
import FinalSuccessModal from "../atoms/FinalSuccessModal";
import LooplingSelector from "../organisms/LooplingSelector";

import Avatar from "../../assets/avatar_preview.png";
import Badge from "../../assets/badge_green_rookie.png";
import Room from "../../assets/room_preview.png";
import Village from "../../assets/preview_village.png";

export default function SignUpComplete() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const nameParam = params.get("name");

  // 스토어
  const social = useSignupStore(selectSocialData);
  const clearSignup = useSignupStore((s) => s.clearSignup);
  const accessToken = useAuthStore(selectAccessToken);

  // 표시명
  const displayName = useMemo(() => {
    if (nameParam && nameParam.trim()) return nameParam.trim();
    if (social?.email) return social.email.split("@")[0];
    return "회원님";
  }, [nameParam, social?.email]);

  // 단계/상태
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [looplingId, setLooplingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 가입 임시데이터 정리
  useEffect(() => {
    clearSignup();
  }, [clearSignup]);

  // 토큰 가드
  useEffect(() => {
    if (!accessToken) {
      alert("로그인 정보가 만료되었어요. 다시 로그인해주세요.");
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleNext = async () => {
    if (loading) return;
    setLoading(true);

    try {
      switch (step) {
        case 1:
          await instance.post(`/users/avatar/default`);
          break;
        case 2:
          await instance.post(`/users/badge/default`);
          break;
        case 3:
          await instance.post(`/users/room/default`);
          break;
        case 4:
          if (!looplingId) {
            alert("루플링을 선택해주세요!");
            setLoading(false);
            return;
          }
          await instance.post(`/users/loopling`, null, { params: { catalogId: looplingId } });
          break;
        case 5:
          await instance.post(`/users/village`);
          await instance.patch(`/users/complete`);
          setShowModal(true);
          setLoading(false);
          return;
        default:
          break;
      }
      setStep((prev) => prev + 1);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || "알 수 없는 오류";
      alert(`처리 중 오류가 발생했습니다. (${status || "ERR"})\n${message}`);
      console.error("🔥 API ERROR", status, err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    setShowModal(false);
    navigate("/quiz", { replace: true });
  };

  const steps = [
    {
      step: 1,
      component: (
        <StepCard
          step={1}
          total={5}
          title={`앞으로 ${displayName}님이 루플에서 사용하게 되실 아바타입니다!`}
          imageUrl={Avatar}
          buttonLabel="아바타 받기"
          onNext={handleNext}
          loading={loading}
        />
      ),
    },
    {
      step: 2,
      component: (
        <StepCard
          step={2}
          total={5}
          title={`순환경제를 시작하게 되신 ${displayName}님께 Green Rookie 뱃지를 드릴게요!`}
          imageUrl={Badge}
          buttonLabel="뱃지 받기"
          onNext={handleNext}
          loading={loading}
        />
      ),
    },
    {
      step: 3,
      component: (
        <StepCard
          step={3}
          total={5}
          title={`${displayName}님이 지내게 될 방이에요!`}
          imageUrl={Room}
          buttonLabel="방 받기"
          onNext={handleNext}
          loading={loading}
        />
      ),
    },
    {
      step: 4,
      component: (
        <LooplingStep
          step={4}
          total={5}
          name={displayName}
          onSelect={(id) => setLooplingId(id)}
          onConfirm={handleNext}
          loading={loading}
        />
      ),
    },
    {
      step: 5,
      component: (
        <StepCard
          step={5}
          total={5}
          title={`${displayName}님이 유저들과 함께 꾸며나갈 마을은 여기입니다!`}
          imageUrl={Village}
          buttonLabel="마을 입장"
          onNext={handleNext}
          loading={loading}
        />
      ),
    },
  ];

  // 배경 + 컨테이너
  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-6 font-ptd-400
        bg-brand-50
        bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]
      "
    >
      {/* 카드 스택 */}
      {steps.find((s) => s.step === step)?.component}

      {/* 완료 모달 */}
      {showModal && (
        <FinalSuccessModal
          name={displayName}
          onConfirm={handleDashboard}
        />
      )}
    </div>
  );
}

/* ---------- 서브 컴포넌트 ---------- */

function StepCard({ step, total, title, imageUrl, buttonLabel, onNext, loading }) {
  return (
    <div
      className="
        w-full max-w-lg
        rounded-2xl p-8 md:p-10 text-center
        bg-white/85 backdrop-blur-md
        ring-1 ring-black/5
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_14px_32px_rgba(0,0,0,0.12)]
        space-y-6
      "
    >
      <ProgressDots current={step} total={total} />

      <h2 className="text-xl md:text-2xl font-ptd-700 text-brand-ink leading-relaxed">
        {title}
      </h2>

      <div
        className="
          mx-auto grid place-items-center
          w-44 h-44 md:w-52 md:h-52
          rounded-2xl bg-white
          ring-1 ring-black/5
          shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]
        "
      >
        <img src={imageUrl} alt="preview" className="w-36 h-36 md:w-40 md:h-40 object-contain" />
      </div>

      <button
        onClick={onNext}
        disabled={loading}
        className="
          w-full h-12 rounded-xl
          bg-brand-600 text-white font-ptd-700
          shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_14px_rgba(0,0,0,0.12)]
          hover:bg-brand-500 transition
          disabled:opacity-60
        "
      >
        {loading ? "처리 중..." : buttonLabel}
      </button>

      <p className="text-xs text-brand-ink/55">
        {step}/{total} 단계
      </p>
    </div>
  );
}

function LooplingStep({ step, total, name, onSelect, onConfirm, loading }) {
  return (
    <div
      className="
        w-full max-w-3xl
        rounded-2xl p-6 md:p-8
        bg-white/85 backdrop-blur-md
        ring-1 ring-black/5
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_14px_32px_rgba(0,0,0,0.12)]
        space-y-6
      "
    >
      <ProgressDots current={step} total={total} />

      <div className="text-center space-y-1">
        <h2 className="text-xl md:text-2xl font-ptd-700 text-brand-ink">
          {name}님의 첫 루플링을 선택해 주세요
        </h2>
        <p className="text-sm text-brand-ink/65">
          루플링은 활동에 따라 성장하며, 마을을 함께 꾸미는 든든한 동료예요.
        </p>
      </div>

      {/* 실제 선택 UI는 기존 컴포넌트 유지 */}
      <div className="rounded-xl p-3 md:p-4 bg-brand-50 ring-1 ring-black/5">
        <LooplingSelector name={name} onSelect={onSelect} onConfirm={onConfirm} loading={loading} />
      </div>

      <div className="text-center">
        <p className="text-xs text-brand-ink/55">{step}/{total} 단계</p>
      </div>
    </div>
  );
}

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const active = i + 1 === current;
        return (
          <span
            key={i}
            className={[
              "inline-block rounded-full transition-all",
              active
                ? "w-7 h-2 bg-brand-600 shadow-[0_2px_6px_rgba(60,154,95,0.45)]"
                : "w-2 h-2 bg-brand-300",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
