// src/components/templates/Header.jsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useAuthStore,
  selectNickname,
  selectClearAuthInfo,
  selectHasHydrated,
} from "../../store/authStore";
import brandLogo from "../../assets/brandLogo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const nickname = useAuthStore(selectNickname);
  const clearAuthInfo = useAuthStore(selectClearAuthInfo);
  const hasHydrated = useAuthStore(selectHasHydrated);


  const menuItems = useMemo(
    () => [
      { label: "Loople 홈", path: "/loopleHome", emoji: "🌿" },
      { label: "마이페이지", path: "/mypage", emoji: "👤" },
      { label: "지역별 규칙", path: "/rule", emoji: "📜" },
      { label: "채팅하기", path: "/chat", emoji: "💬" },
    ],
    []
  );

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuthInfo();
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* 더 은은한 헤더 바: 뉴트럴 바탕 + 소프트 블러 + 얇은 보더 */}
      <div
        className="
          bg-white/80 backdrop-blur-md
          border-b border-[#EAEAEA]
          shadow-[0_1px_8px_rgba(0,0,0,0.04)]
        "
        style={{ fontFamily: "pretendard" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
          <div className="flex items-center gap-3">
            {/* 로고 (중립 버튼 감싸기) */}
            <button
              onClick={() => navigate("/loopleHome")}
              className="
                shrink-0 rounded-xl p-1.5
                bg-white/90 hover:bg-white
                transition
                ring-1 ring-black/5
              "
              aria-label="Loople 홈으로 이동"
            >
              <img src={brandLogo} alt="Loople" className="h-7 w-auto" />
            </button>

            {/* 중앙 메뉴: 절제된 세그먼트(연한 배경 + 활성 1px 보더) */}
            <nav className="flex-1 flex justify-center">
              <div
                className="
                  inline-flex items-center gap-1 p-1 rounded-full
                  bg-[#F6F6F6]/80
                  ring-1 ring-black/5
                  shadow-[inset_0_0.5px_0_rgba(255,255,255,0.6)]
                  overflow-x-auto no-scrollbar
                "
                role="tablist"
                aria-label="primary navigation"
              >
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      role="tab"
                      aria-selected={active}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "group flex items-center gap-1.5 px-4 h-9 rounded-full text-sm transition",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#81C784]/50",
                        active
                          ? [
                              "bg-white/95",
                              "text-[#202020] font-ptd-600",
                              "ring-1 ring-[#81C784]/50",
                              "shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
                            ].join(" ")
                          : [
                              "bg-transparent text-[#404040]",
                              "hover:bg-white/80 hover:text-[#202020]",
                            ].join(" "),
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className={active ? "opacity-80" : "opacity-60 group-hover:opacity-80"}
                      >
                        {item.emoji}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* 우측 유저/액션: 뉴트럴 칩 + 심플 아이콘 버튼 */}
            <div className="shrink-0 flex items-center gap-2">
              {hasHydrated && nickname && (
                <div
                  className="
                    px-3 h-9 inline-flex items-center rounded-full
                    bg-white/90 text-[#202020]
                    text-sm font-medium
                    ring-1 ring-black/5
                    shadow-[inset_0_0.5px_0_rgba(255,255,255,0.7)]
                    max-w-[40vw] md:max-w-none truncate
                  "
                  title={`${nickname}님`}
                >
                  {nickname}님
                </div>
              )}

              <button
                onClick={handleLogout}
                title="로그아웃"
                className="
                  w-9 h-9 inline-flex items-center justify-center rounded-full
                  bg-white/90 hover:bg-white
                  transition
                  ring-1 ring-black/5
                  shadow-[inset_0_0.5px_0_rgba(255,255,255,0.7)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#81C784]/50
                "
                aria-label="로그아웃"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#404040]"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 헤더 아래 아주 옅은 분리선(그라디언트 제거 → 더 미니멀) */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#EDEDED] to-transparent" />
    </div>
  );
}
