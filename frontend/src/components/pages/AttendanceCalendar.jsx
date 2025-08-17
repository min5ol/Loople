// src/components/pages/AttendanceCalendar.jsx
// 작성일: 2025-07-18
// 수정일: 2025-08-17
// 설명: 강제 새로고침 제거, 리하이드/토큰 준비 후에만 API 호출

import React, { useState, useEffect } from "react";
import instance from "../../apis/instance.js";
import {
  useAuthStore,
  selectHasHydrated,
  selectAccessToken,
} from "../../store/authStore";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export const getAttendanceDays = async () => {
  const res = await instance.get(`/quiz/getAttendanceDays`);
  return res.data; // [1,3,9,...] 형태 가정
};

export default function AttendanceCalendar() {
  const hasHydrated = useAuthStore(selectHasHydrated);
  const accessToken = useAuthStore(selectAccessToken);

  const [today] = useState(() => new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [attendanceDays, setAttendanceDays] = useState([]);

  const ready = hasHydrated && !!accessToken;

  // 출석일 불러오기
  useEffect(() => {
    if (!ready) return;

    (async () => {
      try {
        const data = await getAttendanceDays();
        setAttendanceDays(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch attendance days:", error);
      }
    })();
  }, [ready]);

  // 달력 생성
  useEffect(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const daysArray = [];

    for (let i = 0; i < firstWeekday; i++) {
      daysArray.push({ day: null, isToday: false, isAttendance: false });
    }
    for (let d = 1; d <= lastDate; d++) {
      const isToday = d === today.getDate();
      const isAttendance = attendanceDays.includes(d);
      daysArray.push({ day: d, isToday, isAttendance });
    }
    setCalendarDays(daysArray);
  }, [today, attendanceDays]);

  if (!ready) {
    return (
      <div className="min-h-[240px] flex items-center justify-center text-brand-ink/60">
        세션 준비 중...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen px-6 font-ptd-400 flex items-center justify-center
        bg-brand-50
        bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]
      "
    >
      <div
        className="
          w-full max-w-md mx-auto rounded-2xl p-6
          bg-white/80 backdrop-blur-md
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]
        "
      >
        {/* 헤더 */}
        <div className="mb-4 text-center">
          <h3 className="text-xl font-ptd-700 text-brand-ink">
            {today.getFullYear()}년 {today.getMonth() + 1}월 출석
          </h3>
          <p className="text-xs text-brand-ink/60 mt-1">
            오늘은 <span className="font-ptd-600">{today.getDate()}일</span>
            이에요 🌱
          </p>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-x-2 mb-2 text-center text-sm font-ptd-600 text-brand-ink/70">
          {weekdays.map((day) => (
            <div key={day} className="select-none">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(({ day, isToday, isAttendance }, idx) => {
            if (day === null) return <div key={idx} className="aspect-square" />;
            const filled = isToday || isAttendance;

            return (
              <div
                key={idx}
                className={[
                  "aspect-square rounded-xl flex items-center justify-center select-none text-sm font-ptd-600",
                  filled
                    ? "text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_10px_rgba(60,154,95,0.35)] bg-[#5EA776]"
                    : "text-brand-ink/80 bg-brand-50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]",
                ].join(" ")}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* 레전드 */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-brand-ink/60">
          <span className="inline-flex items-center gap-1">
            <i className="w-3 h-3 rounded-sm bg-[#5EA776]" /> 출석/오늘
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="w-3 h-3 rounded-sm bg-brand-50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]" />{" "}
            일반
          </span>
        </div>
      </div>
    </div>
  );
}
