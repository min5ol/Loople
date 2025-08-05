import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import Community from "./Community";
import Header from "./Header";
import Chatbot from "./Chatbot";

// #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020


export default function LoopleHome() {

  return (
    <div className="relative w-full min-h-screen">

      {/* 🧭 상단 네비게이션 탭 */}
      <Header />

      {/* 게시판 */}

      <Community />

      <Chatbot />

    </div>
  );

}