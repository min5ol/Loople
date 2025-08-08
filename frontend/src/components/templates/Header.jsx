// src/components/templates/Header.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ currentUserInfo }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Loople 홈", path: "/loopleHome", emoji: "🌿" },
    { label: "마이페이지", path: "/mypage", emoji: "👤" },
    { label: "마이룸", path: "/myroom", emoji: "🛏️" },
    { label: "마이아바타", path: "/myavatar", emoji: "🧍" },
    { label: "마이루플링", path: "/myloopling", emoji: "🌱" },
    { label: "마이빌리지", path: "/myvillage", emoji: "🏡" },
    { label: "퀴즈 풀기", path: "/quiz", emoji: "🧠" },
    { label: "지역별 규칙", path: "/rule", emoji: "📜" },
    { label: "채팅하기", path: "/chat", emoji: "💬" },
  ];

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 bg-[#FEF7E2] border-b border-[#E5E5E5] shadow-sm"
      style={{ fontFamily: "pretendard" }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        
        {/* 메뉴 */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 whitespace-nowrap">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path, { state: { currentUserInfo } })}
                className={`flex items-center gap-1 px-4 py-1.5 text-sm rounded-full transition-all
                  ${isActive
                    ? "bg-[#3C9A5F] text-white"
                    : "bg-white text-[#264D3D] hover:bg-[#EAF6E2]"
                  }`}
                style={{
                  boxShadow: isActive
                    ? "inset 2px 2px 4px rgba(0,0,0,0.15), inset -2px -2px 4px rgba(255,255,255,0.8)"
                    : "inset 1px 1px 3px rgba(0,0,0,0.12), inset -1px -1px 3px rgba(255,255,255,0.8)",
                  border: "none"
                }}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 닉네임 표시 */}
        {currentUserInfo?.nickname && (
          <div className="ml-4 text-sm font-medium text-[#202020] whitespace-nowrap">
            {currentUserInfo.nickname}님
          </div>
        )}
      </div>
    </div>
  );
}
