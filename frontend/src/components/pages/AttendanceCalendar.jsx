/*
  작성일자: 2025-07-18
  작성자: 백진선
*/
import React, { useState, useEffect } from "react";
import instance from '../../apis/instance.js'; 
import {useNavigate} from 'react-router-dom';

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export const getAttendanceDays = async () => {
  const res = await instance.get('/quiz/getAttendanceDays');
  return res.data;
};

export default function AttendanceCalendar() {
  const [today, setToday] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [attendanceDays, setAttendanceDays] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    handleAttendance();
  }, []);

  useEffect(() => {
  }, [today, attendanceDays]);

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
      generateCalendarDays(today, data);  // 출석 데이터 도착과 동시에 달력 생성
    } catch (error) {
      console.error("Failed to fetch attendance days:", error);
    }
  };

  const handleReturn = async () =>{
    navigate("/quiz");
  }

  return (
    <div className="bg-[#FEF7E2] min-h-screen flex flex-col justify-center items-center">
    <div className="flex justify-center items-center ">
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
    <div className="flex justify-center mt-4">
              <button onClick = {handleReturn} className="bg-white border border-[#749E89] text-[#264D3D] text-sm font-semibold px-6 py-2 rounded-full transition-all hover:bg-[#F6F6F6] hover:scale-105 cursor-pointer">
                되돌아가기
              </button>
          </div>
    </div>
  );
}
