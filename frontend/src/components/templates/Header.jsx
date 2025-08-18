// src/components/templates/Header.jsx
import React from "react";
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

  const menuItems = [
    // { label: "Loople 홈", path: "/loopleHome", emoji: "🌿" },
    { label: "마이페이지", path: "/mypage", emoji: "👤" },
    { label: "지역별 규칙", path: "/rule", emoji: "📜" },
    { label: "채팅하기", path: "/chat", emoji: "💬" },
  ];

  const handleLogout = () => {
    clearAuthInfo();
    navigate("/");
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 bg-[#f2f2f2] border-b border-[#E5E5E5] shadow-sm"
      style={{ fontFamily: "pretendard" }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-2 max-w-7xl mx-auto">
        <img
          src={brandLogo}
          alt="Loople Logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/looplehome")}
        />

        <div className="flex-1 flex justify-center items-center overflow-x-auto no-scrollbar gap-2 whitespace-nowrap mx-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full transition-all border-none
                  ${isActive ? "bg-[#3C9A5F] text-white font-semibold" : "bg-white text-[#264D3D] hover:bg-[#EAF6E2]"}`}
                style={{
                  boxShadow:
                    "inset 1px 1px 3px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.7)",
                }}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {hasHydrated && nickname && (
            <div className="text-sm font-medium text-[#202020] whitespace-nowrap">
              {nickname}님
            </div>
          )}
          <button
            onClick={handleLogout}
            title="로그아웃"
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full border-none cursor-pointer transition-colors hover:bg-gray-200"
            style={{
              boxShadow:
                "inset 1px 1px 3px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.7)",
            }}
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
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
