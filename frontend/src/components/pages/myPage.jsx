import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import instance from '../../apis/instance';
import Header from '../templates/Header';

// 모달
import EditProfileImageModal from '../modals/EditProfileImageModal';
import EditNicknameModal from '../modals/EditNicknameModal';
import EditPhoneModal from '../modals/EditPhoneModal';

// 버튼 공통
const btnBase =
  "font-ptd-600 px-6 py-2.5 rounded-xl border-none transition-all duration-200 ease-out";

function AttendanceCalendar({ attendanceDays = [] }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { days, firstWeekday } = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return {
      days: Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1),
      firstWeekday: firstDayOfMonth.getDay(),
    };
  }, [year, month]);

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/15 hover:bg-primary hover:text-white hover:scale-105 shadow-sm hover:shadow-md transition-all"
        >
          ◀
        </button>
        <h3 className="text-lg font-ptd-700 text-surface-dark select-none">
          {`${year}년 ${month + 1}월 출석 현황`}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/15 hover:bg-primary hover:text-white hover:scale-105 shadow-sm hover:shadow-md transition-all"
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="font-ptd-500 text-gray-400 py-2 select-none">{day}</div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const isAttended = attendanceDays.includes(day);
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          return (
            <div
              key={day}
              className={`flex items-center justify-center h-10 w-10 mx-auto rounded-full text-sm transition-all duration-200
                ${isAttended
                  ? 'bg-gradient-to-br from-primary to-primary-light text-white font-ptd-700 shadow-md'
                  : 'bg-gray-50 text-gray-600'}
                ${isToday && !isAttended ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyPage() {
  const { accessToken } = useAuthStore();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모달 상태
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setIsLoading(false);
        return;
      }
      try {
        const res = await instance.get('/users/mypage');
        setPageData(res.data);
      } catch {
        setError("마이페이지 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent text-lg font-ptd-600 text-surface-dark">
        페이지를 불러오는 중...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent text-lg font-ptd-600 text-red-600">
        {error}
      </div>
    );
  }
  if (!pageData) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-w-ground pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          {/* 프로필 카드 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all">
            <h2 className="text-3xl font-ptd-700 text-surface-dark mb-6 border-b border-gray-100 pb-4">
              마이페이지
            </h2>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group w-36 h-36">
                  <img
                    src={pageData.profileImageUrl}
                    alt="프로필 이미지"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div
                    onClick={() => setShowProfileModal(true)}
                    className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center 
                               opacity-0 group-hover:opacity-100 transition-all duration-200 
                               rounded-full cursor-pointer"
                  >
                    ✏️
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-ptd-700 text-gray-800">{pageData.nickname}</p>
                  <p className="text-sm font-ptd-400 text-gray-500">{pageData.email}</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-5">
                {/* 닉네임 */}
                <p className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 font-ptd-400 flex justify-between">
                  {pageData.nickname}
                  <button
                    onClick={() => setShowNicknameModal(true)}
                    className="text-primary font-ptd-500 hover:underline"
                  >
                    변경
                  </button>
                </p>

                {/* 전화번호 */}
                <p className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 font-ptd-400 flex justify-between">
                  {pageData.phone}
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="text-primary font-ptd-500 hover:underline"
                  >
                    변경
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* 출석 & 포인트 */}
          <div className="grid md:grid-cols-2 gap-8">
            <AttendanceCalendar attendanceDays={pageData.attendanceDays} />
            <div className="bg-gradient-to-br from-primary to-surface-dark p-6 rounded-2xl shadow-lg text-center text-white flex flex-col items-center justify-center">
              <h3 className="text-xl font-ptd-600 opacity-80 mb-2">보유 포인트</h3>
              <p className="text-6xl font-ptd-800">{pageData.points.toLocaleString()}</p>
              <p className="text-2xl font-ptd-700 -mt-1">P</p>
              <p className="text-sm font-ptd-400 opacity-80 mt-4">퀴즈를 풀고 포인트를 모아보세요!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {showProfileModal && (
        <EditProfileImageModal
          onClose={() => setShowProfileModal(false)}
          onSuccess={(url) => setPageData(prev => ({ ...prev, profileImageUrl: url }))}
        />
      )}
      {showNicknameModal && (
        <EditNicknameModal
          currentNickname={pageData.nickname}
          onClose={() => setShowNicknameModal(false)}
          onSuccess={(nick) => setPageData(prev => ({ ...prev, nickname: nick }))}
        />
      )}
      {showPhoneModal && (
        <EditPhoneModal
          currentPhone={pageData.phone}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={(phone) => setPageData(prev => ({ ...prev, phone }))}
        />
      )}
    </>
  );
}
