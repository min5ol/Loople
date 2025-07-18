import React, { useState, useEffect } from "react"; // useEffect 추가 // 수정됨
import instance from '../../apis/instance.js';
import { useNavigate } from "react-router-dom"; // navigate 사용하려면 import 필요 // 수정됨

export const getProblem = async () => {
  const res = await instance.get('/quiz/buildAndShow/test');
  return res.data;
};

export const submitAnswer = async (submittedAnswer) => {
  const res = await instance.post('/quiz/submitAnswer', submittedAnswer);
  return res.data;
};

export default function TodayQuiz() {
  const [problem, setProblem] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate(); // navigate 훅 초기화 // 수정됨

  const goToHome = () => {
    navigate("/home");
  };

  const handleSolve = async () => {
    try {
      const data = await getProblem();
      setProblem(data);
      setSubmitResult(null);
      setErrorMessage(null);
      if(data.hasSolvedToday){
        setErrorMessage("오늘 할당된 모든 문제를 푸셨습니다.");
      }
      console.log("문제 받아오기 성공");
    } catch (error) {
      console.log("문제 받아오기 실패 " + error);
      setErrorMessage("문제 받아오기에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSubmit = async (answer) => {
    try {
      const payLoad = {
        problemId: problem.no,
        submittedAnswer: answer
      };

      const data = await submitAnswer(payLoad);
      setSubmitResult(data);
      setErrorMessage(null);  // 제출 성공 시 에러 초기화
      console.log("제출 성공");
    } catch (error) {
      console.log("제출 실패 " + error);
      setErrorMessage("답안 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 컴포넌트 마운트 시 자동으로 문제 불러오기 // 수정됨
  useEffect(() => {
    handleSolve();
  }, []);

  return (
  <div className="min-h-screen bg-[#FEF7E2] flex flex-col items-center py-10 px-6 font-[pretendard] text-[#202020]">
    {/* 환영해요 + 퀴즈 페이지를 하나의 흰 박스에 통합 // 수정됨 */}
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

      {/* 퀴즈 풀기 버튼 제거 */}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-center">
          {errorMessage}
        </div>
      )}

      {problem && !problem.hasSolvedToday && (
        <div className="mb-6 p-4 border rounded border-gray-300 bg-gray-50 flex flex-col justify-center items-center text-center">
          <p className="text-lg font-semibold mb-4">{problem.question}</p>

          <div className="flex flex-wrap gap-3 justify-center">
            {problem.type === "OX" ? (
              <>
                <button
                  onClick={() => handleSubmit("O")}
                  className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                >
                  O
                </button>
                <button
                  onClick={() => handleSubmit("X")}
                  className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                >
                  X
                </button>
              </>
            ) : problem.type === "MULTIPLE" ? problem.options && problem.options.length > 0 ? (
              problem.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(String.fromCharCode(65 + idx))}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap cursor-pointer"
                >
                  {String.fromCharCode(65 + idx)}. {opt.content}
                </button>
              ))
            ) : (
              <span>문제 오류</span>
            ) : null}
          </div>
        </div>
      )}

      {submitResult && (
        <div>
          <div className="text-center p-4 rounded border border-green-400 bg-green-100 text-green-800">
            <p>
              {(() => {
                if (
                  submitResult.isCorrect &&
                  submitResult.isWeekly &&
                  submitResult.isMonthly
                ) {
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
          <div className="flex justify-center mt-4">
            <p>
              <button
                onClick={goToHome}
                className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer"
              >
                🏠 메인으로 가기
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
