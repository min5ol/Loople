// 작성일: 2025.07.15
// 작성자: 장민솔
// 설명: 로그인 페이지. 이메일/비밀번호 입력 받아 로그인 시도하고, 성공 시 토큰 저장

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../apis/auth";

import brandLogo from "../../assets/brandLogo.png";
import HomeLeft from "../../assets/HomeLeft.png";
import google from "../../assets/google.png";
import kakao from "../../assets/kakao.png";
import naver from "../../assets/naver.png";
import apple from "../../assets/apple.png";

import InputLogin from "../atoms/LoginInputField";
import Submit from "../atoms/LoginSubmit";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 폼 제출 시 실행
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ email, password });
      localStorage.setItem("accessToken", token); // 토큰 저장
      navigate("/quiz"); // 로그인 성공 시 퀴즈 페이지로 이동
    } catch (err) {
      alert(err?.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  // 소셜 로그인 버튼 이미지 목록
  const socialIcons = [
    { src: google, alt: "Google" },
    { src: kakao, alt: "Kakao" },
    { src: naver, alt: "Naver" },
    { src: apple, alt: "Apple" },
  ];

  return (
    <div className="bg-surface-dark flex relative">
      {/* 왼쪽: 로고와 일러스트 */}
      <img
        src={brandLogo}
        alt="Brand Logo"
        className="absolute top-[1.56vw] left-[1.56vw] w-[7.03vw]"
      />
      <img src={HomeLeft} alt="Illustration" className="h-1080px" />

      {/* 오른쪽: 로그인 폼 */}
      <div className="flex flex-col justify-center px-[3vw] w-full max-w-[30vw]">
        <h1 className="text-w-ground text-[3.91vw] font-ptd-600">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col mt-[1.46vw]">
          <label htmlFor="email" className="text-w-ground text-[1.3vw] font-ptd-500 mt-[0.63vw] mb-[0.73vw]">
            Email
          </label>
          <InputLogin
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="text-w-ground text-[1.3vw] font-ptd-500 mt-[1.56vw] mb-[0.73vw]">
            Password
          </label>
          <InputLogin
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 비밀번호 찾기 */}
          <div className="flex justify-end mt-[1.04vw] mb-[1.56vw]">
            <Link to="/forgot-password" className="text-secondary text-[.89vw] font-ptd-400 underline">
              비밀번호를 잊어버리셨습니까?
            </Link>
          </div>

          <Submit>Login</Submit>
        </form>

        {/* 회원가입 안내 */}
        <div className="text-w-ground text-[.89vw] mt-[1.3vw] font-ptd-400 text-center">
          회원이 아닌가요?
        </div>
        <Link
          to="/signup"
          className="text-secondary text-[.73vw] mt-[0.3vw] font-ptd-400 text-center block"
        >
          지금 회원가입 하러가기
        </Link>

        {/* 구분선 + 소셜 로그인 */}
        <div className="flex justify-between items-center mt-[2.71vw]">
          <div className="w-[9.22vw] h-[0.07vw] bg-secondary" />
          <div className="text-secondary text-[1.02vw] font-ptd-400">Or Sign Up With</div>
          <div className="w-[9.22vw] h-[0.07vw] bg-secondary" />
        </div>

        <div className="flex justify-center mt-[1.46vw]">
          {socialIcons.map(({ src, alt }) => (
            <button
              key={alt}
              type="button"
              className="mx-[0.37vw] bg-transparent border-none cursor-pointer"
            >
              <img src={src} alt={alt} className="w-[2.93vw]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}