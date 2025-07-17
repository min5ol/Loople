// components/Onboarding.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "분리배출은 시작입니다",
    description:
      "우리가 제대로 버릴 때, 세상은 다시 순환합니다. Loople은 당신의 동네 기준으로 분리배출을 안내해요.",
    emoji: "♻️",
    illustration: "onboarding-recycling-world.png", // 일러스트 목록은 아래 주석 참고
  },
  {
    title: "식물은 실천의 보상이에요",
    description:
      "당신이 잘 버릴수록, 이 식물은 자라고 성장합니다. 분리배출 습관을 키워보세요!",
    emoji: "🌱",
    illustration: "onboarding-plant-growth.png",
  },
  {
    title: "아바타는 마을 속 당신이에요",
    description:
      "내가 실천한 만큼 더 멋지게 꾸며보세요. 옷도 입히고 표정도 바꿔요.",
    emoji: "🧍",
    illustration: "onboarding-avatar-customize.png",
  },
  {
    title: "방은 나의 실천공간이에요",
    description:
      "내 방을 아기자기하게 꾸미는 즐거움! 실천할수록 더 예뻐져요.",
    emoji: "🏠",
    illustration: "onboarding-room-decorate.png",
  },
  {
    title: "우리 마을이 함께해요",
    description:
      "이건 우리 동네예요. 이웃들과 함께 실천하고, 서로 응원해요!",
    emoji: "🏘️",
    illustration: "onboarding-village-community.png",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => setStep((s) => Math.min(s + 1, slides.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const skip = () => navigate("/home");
  const finish = () => navigate("/home");

  const { title, description, emoji, illustration } = slides[step];

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-6 bg-white">
      <div className="text-center space-y-4">
        <div className="text-5xl">{emoji}</div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">{description}</p>
        <img
          src={`/illustrations/${illustration}`}
          alt={title}
          className="w-72 h-72 object-contain mx-auto"
        />
      </div>

      {/* Indicator */}
      <div className="flex items-center gap-2 my-4">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === step ? "bg-green-600 w-3 h-3" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between w-full max-w-xs items-center text-sm text-gray-600 mb-2">
        <button onClick={prev} disabled={step === 0} className="text-xl px-3">
          ◀
        </button>
        <button onClick={skip} className="underline text-sm">
          건너뛰기
        </button>
        {step === slides.length - 1 ? (
          <button
            onClick={finish}
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
          >
            시작하기
          </button>
        ) : (
          <button onClick={next} className="text-xl px-3">
            ▶
          </button>
        )}
      </div>
    </div>
  );
}
