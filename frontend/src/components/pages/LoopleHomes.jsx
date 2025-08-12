// src/components/pages/LoopleHome.jsx

import React, { useEffect, useState } from "react";
import Community from "./Community";
import Header from "../templates/Header";
import Chatbot from "./Chatbot";
import { useAuthStore } from "../../store/authStore";

// #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020, #f7f7f7ef


export default function LoopleHome() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  console.log(userInfo);

  return (
    <div className="relative pt-20 pb-10">
      {/* 🧭 상단 네비게이션 탭 */}
      <Header />

      {/* 🧾 게시판 */}
      <div className="max-w-5xl mx-auto px-4">
      <Community />
      </div>

      {/* 💬 챗봇 플로팅 */}
      <Chatbot/>
    </div>
  );
}
