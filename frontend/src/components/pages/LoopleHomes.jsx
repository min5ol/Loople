// src/components/pages/LoopleHome.jsx

import React, { useEffect, useState } from "react";
import Community from "./Community";
import Header from "../templates/Header";
import Chatbot from "./Chatbot";
import instance from "../../apis/instance";

// #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020, #f7f7f7ef
export const getUserInfo = async () => {
  const res = await instance.get("/users/userInfo");
  return res.data;
};

export default function LoopleHome() {
  const [currentUserInfo, setCurrentUserInfo] = useState({});

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const user = await getUserInfo();
        setCurrentUserInfo(user);
        console.log("user", user);
      } catch (error) {
        console.error("Failed to fetch Init", error);
      }
    };
    fetchInit();
  }, []);

  return (
    <div className="relative pt-20 pb-10">
      {/* 🧭 상단 네비게이션 탭 */}
      <Header currentUserInfo={currentUserInfo} />

      {/* 🧾 게시판 */}
      <div className="max-w-5xl mx-auto px-4">
        <Community currentUserInfo={currentUserInfo} />
      </div>

      {/* 💬 챗봇 플로팅 */}
      <Chatbot currentUserInfo={currentUserInfo}/>
    </div>
  );
}
