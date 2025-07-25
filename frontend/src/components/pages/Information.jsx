// 작성일: 2025.07.18
// 작성자: 장민솔
// 설명: 회원가입 완료 후 Loople 서비스 철학을 소개하는 슬라이드 페이지. 각 슬라이드는 이미지+텍스트로 구성. 인디케이터와 이동 버튼 포함됨.

// src/components/pages/Information.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import village from "../../assets/villiage.png";
import plant from "../../assets/plant_bloom.png";
import person from "../../assets/woman_avatar.png";
import room from "../../assets/room_full.png";

// 슬라이드 내용: 5개로 구성
const slides = [
  {
    title: "분리배출은 시작입니다",
    description: "우리가 제대로 버릴 때, 세상은 다시 순환합니다. Loople은 당신의 동네 기준으로 분리배출을 안내해요.",
    emoji: "♻️",
    illustration: village,
  },
  {
    title: "식물은 실천의 보상이에요",
    description: "당신이 잘 버릴수록, 이 식물은 자라고 성장합니다. 분리배출 습관을 키워보세요!",
    emoji: "🌱",
    illustration: plant,
  },
  {
    title: "아바타는 마을 속 당신이에요",
    description: "내가 실천한 만큼 더 멋지게 꾸며보세요. 옷도 입히고 표정도 바꿔요.",
    emoji: "🧍",
    illustration: person,
  },
  {
    title: "방은 나의 실천공간이에요",
    description: "내 방을 아기자기하게 꾸미는 즐거움! 실천할수록 더 예뻐져요.",
    emoji: "🏠",
    illustration: room,
  },
  {
    title: "우리 마을이 함께해요",
    description: "이건 우리 동네예요. 이웃들과 함께 실천하고, 서로 응원해요!",
    emoji: "🏘️",
    illustration: village,
  },
];

export default function Information() {
  const [step, setStep] = useState(0); // 현재 슬라이드 인덱스
  const navigate = useNavigate();

  const next = () => setStep((s) => Math.min(s + 1, slides.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const skip = () => navigate("/onboarding");
  const finish = () => navigate("/onboarding");

  const { title, description, emoji, illustration } = slides[step];

  return (
    <div className="min-h-screen bg-[#FEF7E2] flex flex-col justify-between items-center px-6 py-10 font-[pretendard] text-[#202020]">
      {/* 상단 콘텐츠: 이모지, 제목, 설명, 이미지 */}
      <div className="text-center space-y-6 max-w-lg">
        <div className="text-5xl">{emoji}</div>
        <h2 className="text-[1.75rem] font-bold text-[#264D3D]">{title}</h2>
        <p className="text-sm leading-relaxed">{description}</p>
        <img
          src={illustration}
          alt={title}
          className="w-[18rem] h-[18rem] object-contain mx-auto"
        />
      </div>

      {/* 인디케이터: 현재 위치 시각적으로 보여줌 */}
      <div className="flex gap-2 mt-8 mb-4">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`transition-all duration-200 rounded-full ${
              i === step ? "bg-[#3C9A5F] w-3 h-3" : "bg-gray-300 w-2 h-2"
            }`}
          />
        ))}
      </div>

      {/* 하단 네비게이션: 이전, 건너뛰기, 다음 or 시작하기 */}
      <div className="flex justify-between items-center w-full max-w-xs text-sm mb-4">
        <button
          onClick={prev}
          disabled={step === 0}
          className={`
            px-4 py-2 rounded-full font-semibold text-[#264D3D] transition-all
            ${step === 0 ? "opacity-30 cursor-default" : "hover:bg-[#F6F6F6] hover:scale-105"}
          `}
        >
          ◀ 이전
        </button>

        <button
          onClick={skip}
          className="underline text-[#749E89] hover:text-[#3C9A5F] transition-colors"
        >
          건너뛰기
        </button>

        {step === slides.length - 1 ? (
          <button
            onClick={finish}
            className="
              bg-[#3C9A5F] hover:bg-[#264D3D]
              text-white text-sm font-semibold
              px-6 py-2 rounded-full
              transition-all duration-300
              hover:scale-105 active:scale-95
            "
          >
            🌿 시작하기
          </button>
        ) : (
          <button
            onClick={next}
            className="
              px-4 py-2 rounded-full font-semibold text-[#264D3D]
              hover:bg-[#F6F6F6] transition-all hover:scale-105
            "
          >
            다음 ▶
          </button>
        )}
      </div>
    </div>
  );
}
