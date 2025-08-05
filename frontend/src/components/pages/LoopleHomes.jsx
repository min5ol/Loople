// src/components/pages/LoopleHome.jsx

import React from "react";
import Community from "./Community";
import Header from "../templates/Header";
import Chatbot from "./Chatbot";

export default function LoopleHome() {
  return (
    <div className="relative min-h-screen bg-[#FEF7E2] pt-20 pb-10">
      {/* 🧭 상단 네비게이션 탭 */}
      <Header />

      {/* 🧾 게시판 */}
      <div className="max-w-5xl mx-auto px-4">
        <Community />
      </div>

      {/* 💬 챗봇 플로팅 */}
      <Chatbot />
    </div>
  );
}
