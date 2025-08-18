/*
    작성일자: 2025-07-17
    작성자: 백진선
    설명: 사용자에게 매일 퀴즈 문제 제공
        - 백엔드 API를 통해 문제를 받아오고 제출 결과를 받아와 사용자에게 피드백 제공
        - OX 및 객관식 문제를 지원하며, 정답 여부 및 출석 보상 점수를 안내한다
        - 문제를 다 푼 경우 안내 메시지를 보여주고, 메인 페이지로 이동하는 기능 제공
*/

// src/components/pages/TodayQuiz.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import instance from '../../apis/instance.js';  //axios 인스턴스 (API 호출용)
import { useAuthStore } from "../../store/authStore";

//백엔드에서 오늘의 문제를 받아오는 API 호출 함수
export const getProblem = async () => {
  //비동기 API 호출
  const res = await instance.post(`/quiz/getProblem`);
  return res.data;
};

// 사용자가 제출한 답안을 서버에 보내고 결과를 받는 함수
export const submitAnswer = async (submittedAnswer) => {
  //비동기 API 호출
  const res = await instance.post(`/quiz/submitAnswer`, submittedAnswer);
  return res.data;
};

export default function TodayQuiz() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  //컴포넌트 상태 선언 - React 함수형 컴포넌트 내에서 useState 훅으로 상태 선언
  const [problem, setProblem] = useState(null); //현재 받아온 문제 정보
  const [submitResult, setSubmitResult] = useState(null); //답안 제출 결과 정보
  const [errorMessage, setErrorMessage] = useState(null); //에러 메시지 상태
  const [loading, setLoading] = useState(true);  // 페이지 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 정답 제출 상태
  const [selectedAnswer, setSelectedAnswer] = useState(null); //사용자 선택 답안
  const hasFetched = useRef(false); //호출 여부 체크
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/looplehome");
  };

  //문제 받아오기 처리 함수
  const handleSolve = async () => {
    setLoading(true); // 문제 받아오기 시작할 때 로딩 ON
    setSelectedAnswer(null);

    try {
      const data = await getProblem();  //API 호출
      setProblem(data); //문제 상태 저장
      setSubmitResult(null);  //이전 채점 결과 초기화
      setErrorMessage(data.hasSolvedToday ? "오늘 할당된 모든 문제를 푸셨습니다." : null);  //오늘 이미 문제 푼 경우
    } catch (error) {
      setErrorMessage("문제 받아오기에 실패했습니다. 다시 시도해주세요.");  //문제 받아오기 실패 처리
    } finally {
      setLoading(false); // 문제 불러오기 끝났을 때 로딩 OFF
    }
  };

  //답안 제출 처리 함수
  const handleSubmit = async (answer) => {
    if (isSubmitting || submitResult) return;
    setIsSubmitting(true); // 제출 시작
    setSelectedAnswer(answer);  //선택 답안
    try {
      const payLoad = {
        problemId: problem.no,  //문제 번호
        submittedAnswer: answer   //사용자가 선택한 답안
      };

      //비동기 API 호출로 제출
      const data = await submitAnswer(payLoad);

      setSubmitResult(data);  //결과 저장
      setErrorMessage(null);  //에러 메시지 초기화
    } catch (error) {
      //제출 실패 처리
      console.log("제출 실패 " + error);
      setErrorMessage("답안 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false); // 제출 끝
    }
  };

  //컴포넌트가 처음 렌더링 될 때 문제 받아오기 실행
  useEffect(() => {
    if (hasFetched.current) return; //이미 호출했으면 종료
    hasFetched.current = true;  //호출 플래그 설정
    handleSolve();
  }, []);

  return (
    <div className="w-full">
      {/* 상태: 로딩 */}
      {loading && (
        <div className="text-center text-brand-ink/60 text-sm py-8">
          오늘의 퀴즈를 불러오는 중입니다…
        </div>
      )}

      {/* 상태: 에러/이미 풂 */}
      {!loading && errorMessage && (
        <div
          className="
          mb-6 p-6 text-center rounded-2xl
          bg-white/85 backdrop-blur-md ring-1 ring-black/5
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
        "
        >
          <p className="mb-4 text-base font-ptd-600 text-brand-ink">{errorMessage}</p>
          <button
            onClick={goToHome}
            className="
            h-11 px-5 rounded-xl bg-brand-600 text-white font-ptd-700
            shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_12px_rgba(0,0,0,0.12)]
            hover:bg-brand-500 transition
          "
          >
            홈으로 이동
          </button>
        </div>
      )}

      {/* 문제 카드 */}
      {!loading && problem && !problem.hasSolvedToday && (
        <div
          className="
          mb-6 rounded-2xl p-6 md:p-8 text-center
          bg-white/85 backdrop-blur-md ring-1 ring-black/5
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_14px_32px_rgba(0,0,0,0.12)]
        "
        >
          <h3 className="text-lg md:text-xl font-ptd-700 text-brand-ink leading-relaxed mb-4">
            {problem.question}
          </h3>

          {/* 선택지 */}
          <div className="flex flex-col items-center gap-3 mt-2">
            {problem.type === "OX" ? (
              <div className="flex gap-3">
                {["O", "X"].map((val) => {
                  const isSelected = selectedAnswer === val;

                  return (
                    <button
                      key={val}
                      onClick={() => handleSubmit(val)}
                      disabled={isSubmitting || !!submitResult}
                      className={`
          h-11 px-6 rounded-xl text-white font-ptd-700 transition
          shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_12px_rgba(0,0,0,0.12)]

          ${isSelected ? "bg-brand-600" : "bg-brand-500 hover:bg-brand-600 disabled:hover:bg-brand-600"}
          ${submitResult ? "cursor-not-allowed" : ""}
        `}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>


            ) : problem.type === "MULTIPLE" ? (
              problem.options?.length ? (
                <div className="w-full max-w-md flex flex-col gap-2">
                  {problem.options.map((opt, idx) => {
                    const optionKey = String.fromCharCode(65 + idx); // A, B, C...
                    const isSelected = selectedAnswer === optionKey;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSubmit(optionKey)}
                        disabled={isSubmitting || !!submitResult}
                        className={`
          w-full text-left h-12 px-4 rounded-xl transition ring-1 ring-black/5
          shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
          ${isSelected ? "bg-brand-300" : "bg-brand-100 hover:bg-brand-300"}
          ${submitResult ? "cursor-not-allowed" : ""}
          text-brand-ink
        `}
                      >
                        <span className="font-ptd-700 mr-2">{optionKey}.</span>
                        <span className="font-ptd-500">{opt.content}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="text-sm text-brand-ink/60">문제 오류가 있어요.</span>
              )
            ) : null}
          </div>
        </div>
      )}

      {/* 채점 결과 */}
      {submitResult && (
        <div
          className="
          rounded-2xl p-6 md:p-8 text-center
          bg-white/85 backdrop-blur-md ring-1 ring-black/5
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
        "
        >
          <p
            className={[
              "mb-4 text-base font-ptd-700",
              submitResult.isCorrect ? "text-brand-600" : "text-brand-ink/80",
            ].join(" ")}
          >
            {(() => {
              const { isCorrect, isWeekly, isMonthly, points } = submitResult;
              const bonusText = [
                isWeekly ? "주간 출석 보상" : "",
                isMonthly ? "월간 출석 보상" : "",
              ]
                .filter(Boolean)
                .join(" 및 ");

              if (isCorrect) {
                return bonusText
                  ? `정답! ${bonusText}과 함께 +${points}점 획득!`
                  : `정답! +${points}점 획득!`;
              }
              return bonusText
                ? `틀렸습니다. ${bonusText}과 함께 기본 출석 점수로 +${points}점이 지급되었습니다.`
                : `틀렸습니다. 기본 출석 점수로 +${points}점이 지급되었습니다.`;
            })()}
          </p>

          <button
            onClick={goToHome}
            className="
            h-11 px-5 rounded-xl bg-brand-600 text-white font-ptd-700
            shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_12px_rgba(0,0,0,0.12)]
            hover:bg-brand-500 transition
          "
          >
            홈으로 이동
          </button>
        </div>
      )}

      {/* 제출 중 오버레이 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div
            className="
            bg-white/90 backdrop-blur-md px-6 py-5 rounded-2xl
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.12)]
            text-center ring-1 ring-black/5
          "
          >
            <p className="text-base font-ptd-700 text-brand-ink">제출 중입니다</p>
            <p className="text-xs text-brand-ink/60 mt-1">잠시만 기다려주세요…</p>
          </div>
        </div>
      )}
    </div>
  );

}
