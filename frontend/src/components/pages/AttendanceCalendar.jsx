/*
  작성일자: 2025-07-18
  작성자: 백진선
*/

// src/components/pages/AttendanceCalendar.jsx
import React, { useState, useEffect } from "react";
import instance from '../../apis/instance.js';
import { useAuthStore } from "../../store/authStore";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export const getAttendanceDays = async () => {
  const res = await instance.get(`/quiz/getAttendanceDays`);
  return res.data;
};

export default function AttendanceCalendar() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  const [today, setToday] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [attendanceDays, setAttendanceDays] = useState([]);

  useEffect(() => {
    handleAttendance();
  }, []);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    let timer;

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      timer = setTimeout(() => {
        window.location.reload();
      }, 100); // 0.1초 뒤 새로고침
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  function generateCalendarDays(date, attendanceDaysParam = attendanceDays) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const daysArray = [];

    for (let i = 0; i < firstWeekday; i++) {
      daysArray.push({ day: null, isToday: false, isAttendance: false });
    }

    for (let d = 1; d <= lastDate; d++) {
      const isToday =
        d === date.getDate() &&
        month === date.getMonth() &&
        year === date.getFullYear();

      const isAttendance = attendanceDaysParam.includes(d);

      daysArray.push({ day: d, isToday, isAttendance });
    }

    setCalendarDays(daysArray);
  }

  const handleAttendance = async () => {
    try {
      const data = await getAttendanceDays();
      setAttendanceDays(data);
      generateCalendarDays(today, data);
    } catch (error) {
      console.error("Failed to fetch attendance days:", error);
    }
  };


  return (
    //달력
    <div className="border border-gray-300">
      {/* 요일 */}
      <div className="grid grid-cols-7 gap-x-4 mb-2 font-semibold text-gray-700 text-lg max-w-[420px] mx-auto">
        {weekdays.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-x-4 gap-y-3 border border-blue-500 rounded-md p-4 max-w-[420px] mx-auto">
        {calendarDays.map(({ day, isToday, isAttendance }, idx) => {
          if (day === null) {
            return <div key={idx}></div>;
          }

          const bgClass = isToday || isAttendance ? "bg-[#5EA776]" : "bg-gray-100";
          const textClass = isToday || isAttendance ? "text-white" : "text-gray-800";

          return (
            <div key={idx} className={`aspect-square flex justify-center items-center rounded-md font-semibold text-lg select-none cursor-default ${bgClass} ${textClass}`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
