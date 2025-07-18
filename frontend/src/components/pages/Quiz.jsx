import React, { useState } from "react";
import instance from '../../apis/instance.js';

export const getProblem = async () => {
  const res = await instance.get('/quiz/buildAndShow/test');
  return res.data;
};

export const submitAnswer = async (submittedAnswer) => {
  const res = await instance.post('/quiz/submitAnswer', submittedAnswer);
  return res.data;
};

export default function Quiz() {
  const [problem, setProblem] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Page</h1>

      <div className="flex justify-center mb-6">
        <button onClick={handleSolve} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
          퀴즈 풀기
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-center">
          {errorMessage}
        </div>
      )}

      {problem && !problem.hasSolvedToday && (
        <div className="mb-6 p-4 border rounded border-gray-300 bg-gray-50 flex flex-col justify-center items-center text-center">
          <p className="text-lg font-semibold mb-4">
            {problem.question}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {problem.type === "OX" ? (
              <>
                <button onClick={() => handleSubmit('O')} className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
                  O
                </button>
                <button onClick={() => handleSubmit('X')} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer">
                  X
                </button>
              </>
            ) : problem.type === "MULTIPLE" ? (
              problem.options && problem.options.length > 0 ?
              (problem.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSubmit(String.fromCharCode(65 + idx))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap cursor-pointer">
                    {String.fromCharCode(65 + idx)}. {opt.content}
                  </button>
                ))
              ) : (
                <span>문제 오류</span>
              )
            ) : null}
          </div>
        </div>
      )}

      {submitResult && (
        <div className="text-center p-4 rounded border border-green-400 bg-green-100 text-green-800">
          <p>
            {(() => {
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
      )}
    </div>
  );
}
