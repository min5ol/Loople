// 작성일: 2025.07.28
// 작성자: 장민솔
// 설명: 회원가입 완료 후 단계별 지급 슬라이드 진행 컴포넌트

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const userId = params.get("userId");
  const name = params.get("name");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [looplingId, setLooplingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleNext = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      switch (step) {
        case 1:
          await instance.post(`/users/${userId}/avatar/default`);
          break;
        case 2:
          await instance.post(`/users/${userId}/badge/default`);
          break;
        case 3:
          await instance.post(`/users/${userId}/room/default`);
          break;
        case 4:
          if (!looplingId) {
            alert("루플링을 선택해주세요!");
            return;
          }
          await instance.post(`/users/${userId}/loopling?catalogId=${looplingId}`);
          break;
        case 5:
          await instance.post(`/users/${userId}/village`);
          await instance.patch(`/users/${userId}/complete`);
          setShowModal(true);
          return;
        default:
          break;
      }

      setStep((prev) => prev + 1);
    } catch (err) {
      alert("처리 중 오류가 발생했습니다.");
      console.error("🔥 API ERROR", err?.response?.status, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    setShowModal(false);
    navigate("/looplehome");
  };

  const steps = [
    {
      step: 1,
      component: (
        <StepCard
          title={`앞으로 ${name}님이 루플에서 사용하게 되실 아바타입니다!`}
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
          title={`순환경제를 시작하게 되신 ${name}님께 Green Rookie 뱃지를 드릴게요!`}
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
          title={`${name}님이 지내게 될 방이에요!`}
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
          name={name}
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
          title={`${name}님이 유저들과 함께 꾸며나갈 마을은 여기입니다!`}
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
          name={name}
          onConfirm={handleDashboard}
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
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-[#2f7b4d] transition font-semibold"
      >
        {loading ? "처리 중..." : buttonLabel}
      </button>
    </div>
  );
}
