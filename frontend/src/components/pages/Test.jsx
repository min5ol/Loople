import React, { useState, useEffect } from "react";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export default function AttendanceCalendar() {
  const [today, setToday] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // 임의 출석 날짜
  const attendanceDays = [3, 5, 7, 12, 15, 18, 21, 25, 27];

  useEffect(() => {
    generateCalendarDays(today);
  }, [today]);

  function generateCalendarDays(date) {
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

      const isAttendance = attendanceDays.includes(d);

      daysArray.push({ day: d, isToday, isAttendance });
    }

    setCalendarDays(daysArray);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#FEF7E2]">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg font-['Pretendard',sans-serif]">
        <div className="grid grid-cols-7 gap-3 mb-4 font-semibold text-gray-700 text-lg">
          {weekdays.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map(({ day, isToday, isAttendance }, idx) => {
            if (day === null) {
              return <div key={idx} className="w-14 h-14"></div>;
            }

            const bgClass = isToday || isAttendance ? "bg-[#5EA776]" : "bg-gray-100";
            const textClass = isToday || isAttendance ? "text-white" : "text-gray-800";

            return (
              <div
                key={idx}
                className={`w-14 h-14 flex justify-center items-center rounded-md font-semibold text-xl select-none cursor-default ${bgClass} ${textClass}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
