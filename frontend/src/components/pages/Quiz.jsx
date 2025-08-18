// src/components/pages/Quiz.jsx
// 작성일: 2025-07-21
// 수정일: 2025-08-17
// 설명: 토큰/리하이드 준비되기 전에는 API 의존 컴포넌트 렌더 금지 가드 추가

import React, { useState } from "react";
import TodayQuiz from "./TodayQuiz";
import AttendanceCalendar from "./AttendanceCalendar";
import instance from "../../apis/instance";
import {
  useAuthStore,
  selectHasHydrated,
  selectAccessToken,
} from "../../store/authStore";

export const temperoryMakeProblem = async () => {
  const res = await instance.post("/quiz/temp");
  return res.data; // 문제 데이터 반환
};

export default function Quiz() {
  const hasHydrated = useAuthStore(selectHasHydrated);
  const accessToken = useAuthStore(selectAccessToken);

  const [mode, setMode] = useState("attendance");
  const ready = hasHydrated && !!accessToken;

  const goToQuiz = () => setMode("quiz");
  const goToAttendance = () => setMode("attendance");

  return (
    <>
      <div
        className="
          bg-brand-50 min-h-screen flex items-center justify-center px-6
          bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]
        "
      >
        <div
          className="
            w-full max-w-2xl rounded-2xl p-8
            bg-white/80 backdrop-blur-md
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,0,0,0.10)]
            text-center
          "
        >
          {/* 헤더 */}
          <div className="mb-6">
            <div className="text-5xl mb-3">🧠</div>
            <h1 className="text-2xl font-ptd-700 text-brand-ink mb-2">
              환영해요, Loople에 오신 걸!
            </h1>
            <p className="text-sm md:text-base text-brand-ink/70 leading-relaxed">
              우리 동네 분리배출, 얼마나 알고 계신가요? 매일 하루 한 문제!
              <br className="hidden md:block" />
              간단한 퀴즈로 똑똑한 습관을 키워보세요. <b>참여할수록 보상도 UP 🌱</b>
            </p>
          </div>

          {/* 탭형 스위처 */}
          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-brand-50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]">
            <button
              onClick={goToAttendance}
              className={[
                "px-4 h-10 rounded-full text-sm font-ptd-600 transition",
                mode === "attendance"
                  ? "bg-[#7FCF9A] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(60,154,95,0.35)]"
                  : "bg-transparent text-brand-ink/70 hover:text-brand-ink",
              ].join(" ")}
            >
              월간 출석
            </button>
            <button
              onClick={goToQuiz}
              className={[
                "px-4 h-10 rounded-full text-sm font-ptd-600 transition",
                mode === "quiz"
                  ? "bg-[#7FCF9A] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(60,154,95,0.35)]"
                  : "bg-transparent text-brand-ink/70 hover:text-brand-ink",
              ].join(" ")}
            >
              오늘의 퀴즈
            </button>
          </div>

          {/* 본문 */}
          <div className="mt-6">
            {!ready && (
              <div className="text-center text-sm text-brand-ink/60">
                세션 준비 중...
              </div>
            )}

            {ready && mode === "quiz" && (
              <div className="text-left">
                <TodayQuiz />
              </div>
            )}

            {ready && mode === "attendance" && (
              <div className="text-left">
                <AttendanceCalendar />
              </div>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-wrap justify-center mt-8 gap-3">
            <button
              onClick={goToAttendance}
              className="
                ctl-btn-primary rounded-full
                bg-white text-brand-ink
                shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.08)]
                hover:bg-brand-50
              "
            >
              월간 출석 현황 확인하기
            </button>

            <button
              onClick={goToQuiz}
              className="
                ctl-btn-primary rounded-full
                shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.35)]
              "
            >
              퀴즈풀기
            </button>

            <button
              onClick={async () => {
                const dlg = document.getElementById("quiz-modal");
                const titleEl = document.getElementById("quiz-modal-title");
                const descEl = document.getElementById("quiz-modal-desc");

                try {
                  const result = await temperoryMakeProblem();
                  if (titleEl) titleEl.textContent = "임시 문제 생성 완료";
                  if (descEl)
                    descEl.textContent =
                      "새로운 문제가 준비됐어요. 오늘의 퀴즈에서 확인해보세요!";
                  if (dlg && typeof dlg.showModal === "function")
                    dlg.showModal();
                  console.info("임시 문제가 생성되었습니다:", result);
                } catch (error) {
                  console.error("문제 생성 실패:", error);
                  if (titleEl) titleEl.textContent = "문제 생성 실패";
                  if (descEl)
                    descEl.textContent =
                      "문제를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                  if (dlg && typeof dlg.showModal === "function")
                    dlg.showModal();
                }
              }}
              className="
                ctl-btn-primary rounded-full
                bg-white text-brand-ink
                shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.08)]
                hover:bg-brand-50
              "
            >
              임시문제생성
            </button>
          </div>

          {/* 보상 안내 */}
          <p className="mt-5 text-xs text-brand-ink/50">
            퀴즈는 매일 1회 참여 가능해요. 출석을 이어가면 보상이 커져요!
          </p>
        </div>
      </div>

      {/* 라이트 글래스 모달 (dialog) */}
      <dialog
        id="quiz-modal"
        className="
          rounded-2xl p-0 w-[92%] max-w-sm
          bg-white/80 backdrop-blur-md
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_10px_24px_rgba(0,0,0,0.12)]
        "
      >
        <div className="p-6">
          <h3
            id="quiz-modal-title"
            className="text-lg font-ptd-700 text-brand-ink"
          >
            안내
          </h3>
          <p
            id="quiz-modal-desc"
            className="mt-2 text-sm text-brand-ink/70 leading-relaxed"
          >
            내용이 여기에 표시됩니다.
          </p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                const dlg = document.getElementById("quiz-modal");
                if (dlg && typeof dlg.close === "function") dlg.close();
              }}
              className="ctl-btn-primary w-auto px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(60,154,95,0.35)]"
            >
              확인
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
