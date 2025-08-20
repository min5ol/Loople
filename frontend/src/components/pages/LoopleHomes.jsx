// src/components/pages/LoopleHome.jsx
import React from "react";
import Community from "./Community";
import Header from "../templates/Header";
import Chatbot from "./Chatbot";
// 브랜드 팔레트: #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020

export default function LoopleHome() {
  return (
    <div
      className="
        min-h-screen
        font-ptd-400 text-brand-ink
        bg-brand-50
        bg-[radial-gradient(1100px_700px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_95%_5%,#FEF7E2_0%,transparent_40%)]
      "
    >
      {/* 고정 헤더 */}
      <Header />

      {/* 페이지 컨텐츠 */}
      <main className="pt-20 pb-16">
        {/* 히어로/인사 배너 (라이트 글래스) */}
        <section className="px-4">
          <div
            className="
              max-w-6xl mx-auto rounded-2xl p-6 md:p-8
              bg-white/75 backdrop-blur-md
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_rgba(0,0,0,0.10)]
            "
          >
            <h1 className="text-2xl md:text-3xl font-ptd-700 text-brand-ink">
              루플 커뮤니티 🌿
            </h1>
            <p className="mt-2 text-sm md:text-base text-brand-ink/70">
              분리배출 팁을 공유하고 오늘의 루플링 소식도 확인하세요.
            </p>
          </div>
        </section>

        {/* 커뮤니티 리스트 */}
        <section className="mt-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div
              className="
                rounded-2xl p-4 md:p-6
                bg-white/80 backdrop-blur-md
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.60),0_12px_28px_rgba(0,0,0,0.08)]
              "
            >
              <Community />
            </div>
          </div>
        </section>
      </main>

      {/* 플로팅 챗봇 */}
      <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6">
          <Chatbot />
      </div>
    </div>
  );
}
