// 작성일: 2025.08.05
// 작성자: 장민솔
// 설명: 로그인/회원가입 진입 포함 홈화면 (소셜+로컬 로그인 + 디자인 피드백 반영)

import React, { useState } from "react";
import logo from "../../assets/brandLogo.png";
import googleIcon from "../../assets/google.png";
import kakaoIcon from "../../assets/kakao.png";
import naverIcon from "../../assets/naver.png";
import appleIcon from "../../assets/apple.png";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

export default function Home() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await instance.post("/users/login", form);
      const { accessToken } = res.data;
      const { nickname } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("nickname", nickname);
      navigate("/quiz");
    } catch (err) {
      alert("로그인 실패: " + err.response?.data?.message);
    }
  };

  const socialProviders = [
    { id: "google", name: "Google", icon: googleIcon, bg: "bg-white", text: "text-[#202020]" },
    { id: "kakao", name: "Kakao", icon: kakaoIcon, bg: "bg-[#FEE500]", text: "text-[#3C1E1E]" },
    { id: "naver", name: "Naver", icon: naverIcon, bg: "bg-[#03C75A]", text: "text-white" },
    { id: "apple", name: "Apple", icon: appleIcon, bg: "bg-[#000000]", text: "text-white" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#264D3D] font-ptd-400">
      <div className="bg-[#FEF7E2] w-full max-w-md p-10 rounded-2xl shadow-xl box-border">
        <div className="text-center">
          <img src={logo} alt="Loople Logo" className="h-14 mb-6 inline-block" />
        </div>

        <h2 className="text-xl sm:text-2xl font-ptd-700 text-b-ground text-center mb-1">
          나만의 루플 마을에 오신 걸 환영해요
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          로그인하고 루플링들과 함께 순환경제를 실천해요 🌱
        </p>

        {/* 로컬 로그인 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-lg hover:bg-[#2f7b4d] transition font-ptd-600 border-none shadow-inner"
          >
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-2 text-xs text-[#888] my-6">
          <div className="flex-1 h-px bg-[#DADADA]" />
          또는
          <div className="flex-1 h-px bg-[#DADADA]" />
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          {socialProviders.map(({ id, name, icon, bg, text }) => (
            <button
              key={id}
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/${id}`)
              }
              className={`w-full h-12 flex items-center border-none justify-center gap-3 rounded-lg ${bg} ${text} hover:opacity-90 transition font-ptd-500`}
            >
              <img src={icon} alt={name} className="w-5 h-5" />
              <span className="text-sm">{name}로 시작하기</span>
            </button>
          ))}
        </div>

        {/* 회원가입 안내 */}
        <p className="mt-8 text-sm text-center text-[#202020]">
          계정이 없으신가요?{" "}
          <span
            className="text-[#3C9A5F] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}
