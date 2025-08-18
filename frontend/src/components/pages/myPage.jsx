// src/components/pages/MyPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuthStore, selectAccessToken } from "../../store/authStore";
import instance from "../../apis/instance";
import Header from "../templates/Header";

// 모달
import EditProfileImageModal from "../modals/EditProfileImageModal";
import EditNicknameModal from "../modals/EditNicknameModal";
import EditPhoneModal from "../modals/EditPhoneModal";

// 브랜드 팔레트 (참고): #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020

const BRAND = {
  ring: "#81C784",
  ink: "#202020",
  gray900: "#1f2937",
  gray700: "#374151",
  gray600: "#4b5563",
  gray500: "#6b7280",
  gray400: "#9ca3af",
  gray300: "#d1d5db",
  gray200: "#e5e7eb",
  gray100: "#f3f4f6",
  gray50: "#f9fafb",
};

// -------------------- AttendanceCalendar --------------------
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

  // 달력 칩 스타일(더 절제된 톤)
  const DayChip = ({ day, isToday, isAttended }) => {
    const base =
      "flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full text-sm transition";
    if (isAttended) {
      // 출석일: 진한 채우기 대신 "연한 칩 + 또렷한 텍스트"
      return (
        <div
          className={`${base} bg-white text-[${BRAND.ink}] font-ptd-700 ring-1`}
          style={{ ringColor: BRAND.ring, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
          title="출석 완료"
        >
          {day}
        </div>
      );
    }
    if (isToday) {
      // 오늘(미출석): 굵은 보더 대신 은은한 ring
      return (
        <div
          className={`${base} bg-[${BRAND.gray50}] text-[${BRAND.gray700}]`}
          style={{
            boxShadow: `inset 0 0 0 2px ${BRAND.ring}`,
          }}
          title="오늘"
        >
          {day}
        </div>
      );
    }
    return (
      <div className={`${base} bg-[${BRAND.gray50}] text-[${BRAND.gray600}]`}>
        {day}
      </div>
    );
  };

  return (
    <div
      className="
        bg-white p-5 sm:p-6 rounded-2xl
        border border-[#EAEAEA]
        shadow-[0_4px_16px_rgba(0,0,0,0.06)]
        transition-all duration-300 hover:shadow-[0_6px_22px_rgba(0,0,0,0.08)] hover:-translate-y-0.5
      "
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => changeMonth(-1)}
          className="
            w-8 h-8 md:w-9 md:h-9 inline-flex items-center justify-center rounded-full
            bg-white hover:bg-[#F6F6F6]
            ring-1 ring-black/5 transition
          "
          aria-label="이전 달"
        >
          ◀
        </button>
        <h3 className="text-base md:text-lg font-ptd-700 text-[#202020] select-none">
          {`${year}년 ${month + 1}월 출석`}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className="
            w-8 h-8 md:w-9 md:h-9 inline-flex items-center justify-center rounded-full
            bg-white hover:bg-[#F6F6F6]
            ring-1 ring-black/5 transition
          "
          aria-label="다음 달"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs md:text-sm">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="font-ptd-600 text-[#9CA3AF] py-1.5 select-none">
            {d}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isAttended = attendanceDays.includes(day);
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          return (
            <div key={day} className="flex items-center justify-center py-0.5">
              <DayChip day={day} isToday={isToday} isAttended={isAttended} />
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-4 flex items-center justify-center gap-5 text-xs text-[#6B7280]">
        <span className="inline-flex items-center gap-1.5">
          <i
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#fff", boxShadow: `inset 0 0 0 1px ${BRAND.ring}` }}
          />
          출석
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: BRAND.gray50, boxShadow: `inset 0 0 0 2px ${BRAND.ring}` }}
          />
          오늘
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="w-3 h-3 rounded-full bg-[#F6F6F6]" />
          일반
        </span>
      </div>
    </div>
  );
}

// -------------------- MyPage --------------------
export default function MyPage() {
  const accessToken = useAuthStore(selectAccessToken);
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
        const res = await instance.get("/users/mypage");
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 grid place-items-center bg-[#F6F6F6]">
          <div className="rounded-xl bg-white/90 px-4 py-2 ring-1 ring-black/5 shadow-sm text-sm text-[#6B7280]">
            페이지를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 grid place-items-center bg-[#F6F6F6]">
          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-red-200/60 shadow text-[#B91C1C] text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }
  if (!pageData) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F6F6F6] pt-24 pb-14">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* 프로필 카드 */}
          <section
            className="
              bg-white p-6 md:p-8 rounded-2xl
              border border-[#EAEAEA]
              shadow-[0_4px_16px_rgba(0,0,0,0.06)]
              transition-all hover:shadow-[0_6px_22px_rgba(0,0,0,0.08)] hover:-translate-y-0.5
            "
          >
            <h2 className="text-2xl md:text-3xl font-ptd-700 text-[#202020] mb-6">
              마이페이지
            </h2>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group w-32 h-32 md:w-36 md:h-36">
                  <img
                    src={pageData.profileImageUrl}
                    alt="프로필 이미지"
                    className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-[0_10px_22px_rgba(0,0,0,0.10)]"
                  />
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="
                      absolute inset-0 rounded-full
                      bg-black/20 backdrop-blur-[1px]
                      opacity-0 group-hover:opacity-100 transition
                      flex items-center justify-center
                      text-white text-sm
                      focus:opacity-100 focus:outline-none
                    "
                    aria-label="프로필 이미지 변경"
                    title="프로필 이미지 변경"
                  >
                    ✏️ 편집
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-ptd-700 text-[#202020]">
                    {pageData.nickname}
                  </p>
                  <p className="text-xs md:text-sm font-ptd-400 text-[#6B7280]">
                    {pageData.email}
                  </p>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="md:col-span-2 space-y-4">
                {/* 닉네임 */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#F9FAFB] text-[#374151] ring-1 ring-[#E5E7EB]">
                  <span className="truncate">{pageData.nickname}</span>
                  <button
                    onClick={() => setShowNicknameModal(true)}
                    className="
                      px-3 h-9 rounded-lg bg-white
                      ring-1 ring-black/5
                      text-[#202020] text-sm
                      hover:bg-[#F6F6F6] transition
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#81C784]/50
                    "
                  >
                    변경
                  </button>
                </div>

                {/* 전화번호 */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#F9FAFB] text-[#374151] ring-1 ring-[#E5E7EB]">
                  <span className="truncate">{pageData.phone}</span>
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="
                      px-3 h-9 rounded-lg bg-white
                      ring-1 ring-black/5
                      text-[#202020] text-sm
                      hover:bg-[#F6F6F6] transition
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#81C784]/50
                    "
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 출석 & 포인트 */}
          <section className="grid md:grid-cols-2 gap-8">
            <AttendanceCalendar attendanceDays={pageData.attendanceDays} />

            {/* 포인트 카드: 모노톤 + 작은 그린 포인트 */}
            <div
              className="
                bg-white p-6 md:p-8 rounded-2xl
                border border-[#EAEAEA]
                shadow-[0_4px_16px_rgba(0,0,0,0.06)]
                flex flex-col items-center justify-center text-center
              "
            >
              <h3 className="text-base md:text-lg font-ptd-600 text-[#6B7280] mb-2">
                보유 포인트
              </h3>
              <div className="flex items-end gap-2">
                <p className="text-5xl md:text-6xl font-ptd-800 tracking-tight text-[#202020]">
                  {Number(pageData.points || 0).toLocaleString()}
                </p>
                <span
                  className="text-sm px-2 py-1 rounded-full"
                  style={{
                    background: "#F0FDF4",
                    color: "#166534",
                    boxShadow: "inset 0 0 0 1px rgba(22,101,52,0.12)",
                  }}
                >
                  P
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#6B7280] mt-3">
                퀴즈로 포인트를 모아 보상을 받아보세요.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* 모달 */}
      {showProfileModal && (
        <EditProfileImageModal
          onClose={() => setShowProfileModal(false)}
          onSuccess={(url) =>
            setPageData((prev) => ({ ...prev, profileImageUrl: url }))
          }
        />
      )}
      {showNicknameModal && (
        <EditNicknameModal
          currentNickname={pageData.nickname}
          onClose={() => setShowNicknameModal(false)}
          onSuccess={(nick) =>
            setPageData((prev) => ({ ...prev, nickname: nick }))
          }
        />
      )}
      {showPhoneModal && (
        <EditPhoneModal
          currentPhone={pageData.phone}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={(phone) => setPageData((prev) => ({ ...prev, phone }))}
        />
      )}
    </>
  );
}
