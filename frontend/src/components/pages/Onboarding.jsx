import React from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const goToQuiz = () => {
    navigate("/quiz");
  };
  
  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEF7E2] px-6 py-10 text-[#202020] font-[pretendard]">
      <div className="text-6xl mb-4">🧠</div>
      <h1 className="text-2xl font-bold text-[#264D3D] mb-2">환영해요, Loople에 오신 걸!</h1>
      <p className="text-sm text-center text-[#3C3C3C] max-w-md mb-8 leading-relaxed">
        동네 분리배출 정보를 얼마나 알고 계신가요? <br />
        퀴즈를 통해 재미있게 확인해보세요!
        하루에 한 문제씩 
      </p>

      <div className="flex gap-4">
        <button
          onClick={goToQuiz}
          className="bg-[#3C9A5F] hover:bg-[#264D3D] text-white text-sm font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
        >
          ✨ 퀴즈 풀기
        </button>
        <button
              onClick={goToHome}
              className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105"
            >
              🏠 메인으로 가기
            </button>
      </div>
    </div>
  );
}