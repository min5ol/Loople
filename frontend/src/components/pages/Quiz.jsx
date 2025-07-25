/*
  작성일자: 2025-07-21
  작성자: 백진선
*/

// src/components/pages/Quiz.jsx

import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import TodayQuiz from "./TodayQuiz";
import AttendanceCalendar from "./AttendanceCalendar";

export default function Quiz() {
  const [mode, setMode] = useState("attendance");

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/looplehome");
  };

  const goToQuiz = () =>{
    setMode("quiz");
  }

  const goToAttendance = () => {
    setMode("attendance");
  }

return (
  <div className="bg-[#FEF7E2] min-h-screen flex flex-col justify-center items-center">
    <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 mb-10 text-center">
      {/*헤더*/}
      <div>
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-2xl font-bold text-[#264D3D] mb-4">
          환영해요, Loople에 오신 걸!
        </h1>
        <p className="text-base text-[#3C3C3C] leading-relaxed mb-8">
          동네 분리배출 정보를 얼마나 알고 계신가요? <br />
          매일 한 문제씩 퀴즈로 확인하며 똑똑하게 분리배출하는 습관을 만들어봐요! <br />
          <strong>매일 접속하면 깜짝 선물이 기다리고 있으니, 놓치지 마세요!</strong>
        </p>
      </div>

      {mode == "quiz" && (
        <div>
          <TodayQuiz/>
        </div>
      )}

      {mode == "attendance" && (
        <div>
          <AttendanceCalendar/>
        </div>
      )}

      <div className="flex justify-center mt-4 gap-4">
        <button onClick={goToAttendance} className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer">
          월간 출석 현황 확인하기
        </button>
        <button onClick={goToQuiz} className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer">
          퀴즈풀기
        </button>
        <button onClick={goToHome} className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer">
          home
        </button>
      </div>
      
    </div>
  </div>
);


}
