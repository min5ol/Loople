// src/components/templates/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({currentUserInfo}) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Loople 홈", path: "/loopleHome", emoji: "🌿" },
    { label: "마이페이지", path: "/mypage", emoji: "👤" },
    { label: "마이룸", path: "/myroom", emoji: "🛏️" },
    { label: "마이아바타", path: "/myavatar", emoji: "🧍" },
    { label: "마이루플링", path: "/myloopling", emoji: "🌱" },
    { label: "마이빌리지", path: "/myvillage", emoji: "🏡" },
    { label: "퀴즈 풀기", path: "/quiz", emoji: "🧠" },
    { label: "지역별 규칙", path: "/rule", emoji: "📜" },
    { label: "채팅하기", path: "/chat"},
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-[#FEF7E2] border-b border-[#DADADA] shadow-sm">
      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 py-2 justify-center whitespace-nowrap">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path, {state: {currentUserInfo}})}
            className="flex items-center gap-1 px-4 py-1.5 text-sm bg-white border border-[#3C9A5F] text-[#264D3D] rounded-full shadow-sm hover:bg-[#CCE7B8] transition"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
