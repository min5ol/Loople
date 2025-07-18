/*
    작성일자: 2025-07-17
    작성자: 백진선
    설명: 사용자에게 매일 퀴즈 문제 제공
        - 백엔드 API를 통해 문제를 받아오고 제출 결과를 받아와 사용자에게 피드백 제공
        - OX 및 객관식 문제를 지원하며, 정답 여부 및 출석 보상 점수를 안내한다
        - 문제를 다 푼 경우 안내 메시지를 보여주고, 메인 페이지로 이동하는 기능 제공
*/
import React, { useState, useEffect } from "react";
import instance from '../../apis/instance.js';  //axios 인스턴스 (API 호출용)
import { useNavigate } from "react-router-dom";

//백엔드에서 오늘의 문제를 받아오는 API 호출 함수
export const getProblem = async () => {
  //비동기 API 호출
  const res = await instance.get('/quiz/buildAndShow/test');
  return res.data;  //문제 데이터 반환
};

// 사용자가 제출한 답안을 서버에 보내고 결과를 받는 함수
export const submitAnswer = async (submittedAnswer) => {
  //비동기 API 호출
  const res = await instance.post('/quiz/submitAnswer', submittedAnswer);
  return res.data;  //응답 채점 결과 반환
};

export default function TodayQuiz() {
  //컴포넌트 상태 선언 - React 함수형 컴포넌트 내에서 useState 훅으로 상태 선언
  const [problem, setProblem] = useState(null); //현재 받아온 문제 정보
  const [submitResult, setSubmitResult] = useState(null); //답안 제출 결과 정보
  const [errorMessage, setErrorMessage] = useState(null); //에러 메시지 상태

  const navigate = useNavigate(); //페이지 이동 훅

  //월간 출석 현황 확인
  const goToMonthlyCalendar = () => {
    navigate("/attendanceCalendar");
  };

  const goToHome = () => {
    navigate("/home");
  };

  //문제 받아오기 처리 함수
  const handleSolve = async () => {
    try {
      const data = await getProblem();  //API 호출
      setProblem(data); //문제 상태에 저장
      setSubmitResult(null);  //이전 채점 결과 초기화
      setErrorMessage(null);  //에러 메시지 초기화
      
      //오늘 이미 문제를 푼 경우
      if(data.hasSolvedToday){
        setErrorMessage("오늘 할당된 모든 문제를 푸셨습니다.");
      }
      console.log("문제 받아오기 성공");
    } catch (error) {
      //문제 받아오기 실패 시 처리
      console.log("문제 받아오기 실패 " + error);
      setErrorMessage("문제 받아오기에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //답안 제출 처리 함수
  const handleSubmit = async (answer) => {
    try {
      const payLoad = {
        problemId: problem.no,  //문제 번호
        submittedAnswer: answer //사용자가 선택한 답안
      };

      //비동기 API 호출로 제출
      const data = await submitAnswer(payLoad);

      setSubmitResult(data);  //결과 상태 저장
      setErrorMessage(null);  //에러 메시지 초기화
      console.log("제출 성공");
    } catch (error) {
      //제출 실패 시 처리
      console.log("제출 실패 " + error);
      setErrorMessage("답안 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //컴포넌트가 처음 렌더링 될 때 문제 받아오기 실행
  useEffect(() => {
    handleSolve();
  }, []);

  return (
  <div className="min-h-screen bg-[#FEF7E2] flex flex-col items-center py-10 px-6 font-[pretendard] text-[#202020]">
    <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8 mb-10 text-center">
      <div className="text-6xl mb-4">🧠</div>
      <h1 className="text-2xl font-bold text-[#264D3D] mb-4">
        환영해요, Loople에 오신 걸!
      </h1>
      <p className="text-base text-[#3C3C3C] leading-relaxed mb-8">
        동네 분리배출 정보를 얼마나 알고 계신가요? <br />
        매일 한 문제씩 퀴즈로 확인하며 똑똑하게 분리배출하는 습관을 만들어봐요! <br />
        <strong>매일 접속하면 깜짝 선물이 기다리고 있으니, 놓치지 마세요!</strong>
      </p>

      {/* 에러 메시지 출력 영역 - errorMessage 내부에 데이터가 있으면 아래 로직 수행 */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-center">
          {errorMessage}
        </div>
      )}

      {/* 문제 보여주기 (아직 풀지 않았을 때) */}
      {problem && !problem.hasSolvedToday && (
        <div className="mb-6 p-4 border rounded border-gray-300 bg-gray-50 flex flex-col justify-center items-center text-center">
          <p className="text-lg font-semibold mb-4">{problem.question}</p>

          <div className="flex flex-wrap gap-3 justify-center">
            {/* OX 문제일 때 */}
            {problem.type === "OX" ? (
              <>
                <button onClick={() => handleSubmit("O")} className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
                  O
                </button>
                <button onClick={() => handleSubmit("X")} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer" >
                  X
                </button>
              </>
            ) : 
             /* 객관식 문제일 때, 옵션이 존재하는 경우 */
            problem.type === "MULTIPLE" ? problem.options && problem.options.length > 0 ? (
              problem.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleSubmit(String.fromCharCode(65 + idx))} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap cursor-pointer">
                  {String.fromCharCode(65 + idx)}. {opt.content}
                </button>
              ))
            ) : (
              <span>문제 오류</span>
            ) : null}
          </div>
        </div>
      )}

      {/* 제출 결과 보여주기 */}
      {submitResult && (
        <div>
          <div className="text-center p-4 rounded border border-green-400 bg-green-100 text-green-800">
            <p>
              {(() => {
                // 제출 결과에 따른 안내 문구 분기
                if (submitResult.isCorrect && submitResult.isWeekly && submitResult.isMonthly) {
                  return `정답! 주간 출석 보상 및 월간 출석 보상과 함께 +${submitResult.points}점 획득!`;
                } else if (submitResult.isCorrect && submitResult.isWeekly) {
                  return `정답! 주간 출석 보상과 함께 +${submitResult.points}점 획득!`;
                } else if (submitResult.isCorrect && submitResult.isMonthly) {
                  return `정답! 월간 출석 보상과 함께 +${submitResult.points}점 획득!`;
                } else if (submitResult.isCorrect) {
                  return `정답! +${submitResult.points}점 획득!`;
                } else {
                  return `틀렸습니다. 출석 점수만 +${submitResult.points} 되었습니다.`;
                }
              })()}
            </p>
          </div>
          <div className="flex justify-center mt-4 gap-4">
              <button onClick={goToMonthlyCalendar} className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer">
                월간 출석 현황 확인하기
              </button>
              <button onClick={goToHome} className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer">
                home
              </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
