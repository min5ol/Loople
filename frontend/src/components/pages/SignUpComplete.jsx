// src/components/pages/SignUpComplete.jsx
// 작성일: 2025.07.28
// 수정일: 2025.08.12
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

  // ✅ signup 스토어: socialData/clearSignup만 선택
  const social = useSignupStore(selectSocialData);
  const clearSignup = useSignupStore((s) => s.clearSignup);

  // ✅ 인증 토큰 가드 (지급 API는 보통 인증 필요)
  const accessToken = useAuthStore(selectAccessToken);

  const displayName = useMemo(() => {
    if (nameParam && nameParam.trim()) return nameParam.trim();
    if (social?.email) return social.email.split("@")[0];
    return "회원님";
  }, [nameParam, social?.email]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [looplingId, setLooplingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 스토어 정리(가입 플로우 임시 데이터 제거)
    clearSignup();
  }, [clearSignup]);

  useEffect(() => {
    if (!accessToken) {
      // 토큰이 없으면 지급 API 호출해도 죄다 401이므로 사용자 안내 후 홈으로
      alert("로그인 정보가 만료되었어요. 다시 로그인해주세요.");
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleNext = async () => {
    if (loading) return;
    setLoading(true);

    try {
      switch (step) {
        case 1: {
          await instance.post(`/users/avatar/default`);
          break;
        }
        case 2: {
          await instance.post(`/users/badge/default`);
          break;
        }
        case 3: {
          await instance.post(`/users/room/default`);
          break;
        }
        case 4: {
          if (!looplingId) {
            alert("루플링을 선택해주세요!");
            setLoading(false);
            return;
          }
          await instance.post(`/users/loopling`, null, {
            params: { catalogId: looplingId },
          });
          break;
        }
        case 5: {
          await instance.post(`/users/village`);
          await instance.patch(`/users/complete`);
          setShowModal(true); // 완료 모달 노출
          setLoading(false);
          return;
        }
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

  // ✅ 완료 후 퀴즈 페이지로 이동
  const handleDashboard = () => {
    setShowModal(false);
    navigate("/quiz", { replace: true });
  };

  const steps = [
    {
      step: 1,
      component: (
        <StepCard
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
        <LooplingSelector
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
          title={`${displayName}님이 유저들과 함께 꾸며나갈 마을은 여기입니다!`}
          imageUrl={Village}
          buttonLabel="마을 입장"
          onNext={handleNext}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7E2] px-6 font-[pretendard]">
      {steps.find((s) => s.step === step)?.component}

      {showModal && (
        <FinalSuccessModal
          name={displayName}
          onConfirm={handleDashboard}   // ← 모달 확인 시 /quiz 이동
        />
      )}
    </div>
  );
}

function StepCard({ title, imageUrl, buttonLabel, onNext, loading }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl text-center space-y-6 max-w-md w-full">
      <h2 className="text-xl font-bold text-[#264D3D]">{title}</h2>
      <img src={imageUrl} alt="preview" className="w-40 h-40 object-contain mx-auto" />
      <button
        onClick={onNext}
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-[#2f7b4d] transition font-semibold disabled:opacity-60"
      >
        {loading ? "처리 중..." : buttonLabel}
      </button>
    </div>
  );
}
