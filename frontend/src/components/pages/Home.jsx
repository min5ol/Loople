import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../apis/auth";
import brandLogo from "../../assets/brandLogo.png";
import HomeLeft from "../../assets/HomeLeft.png";
import InputLogin from "../atoms/LoginInputField";
import Submit from "../atoms/LoginSubmit";
import google from "../../assets/google.png";
import kakao from "../../assets/kakao.png";
import naver from "../../assets/naver.png";
import apple from "../../assets/apple.png";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ email, password });
      localStorage.setItem("accessToken", token);
      navigate("/quiz");
    } catch (err) {
      alert(err?.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  const socialIcons = [
    { src: google, alt: "Google" },
    { src: kakao, alt: "Kakao" },
    { src: naver, alt: "Naver" },
    { src: apple, alt: "Apple" },
  ];

  return (
    <div className="bg-surface-dark w-screen flex relative">
      {/* 로고 & 왼쪽 이미지 */}
      <img
        src={brandLogo}
        alt="Brand Logo"
        className="absolute top-[1.17vw] left-[1.54vw] w-[6.59vw]"
      />
      <img src={HomeLeft} alt="Illustration" className="w-[64.13vw]" />

      {/* 로그인 폼 */}
      <div className="flex flex-col justify-center px-[3vw] w-full max-w-[30vw]">
        <h1 className="text-w-ground text-[4.39vw] font-ptd-600">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col mt-[1.46vw]">
          <label htmlFor="email" className="text-w-ground text-[1.46vw] font-ptd-500 mt-[0.73vw] mb-[0.73vw]">
            Email
          </label>
          <InputLogin
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="text-w-ground text-[1.46vw] font-ptd-500 mt-[0.73vw] mb-[0.73vw]">
            Password
          </label>
          <InputLogin
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end mt-[1.17vw] mb-[1.61vw]">
            <Link to="/forgot-password" className="text-secondary text-[1.02vw] font-ptd-400 underline">
              비밀번호를 잊어버리셨습니까?
            </Link>
          </div>

          <Submit>Login</Submit>
        </form>

        {/* 회원가입 링크 */}
        <div className="text-w-ground text-[1.02vw] mt-[1.17vw] font-ptd-400 text-center">
          회원이 아닌가요?
        </div>
        <Link
          to="/signup"
          className="text-secondary text-[1.02vw] mt-[0.3vw] font-ptd-400 text-center block"
        >
          지금 회원가입 하러가기
        </Link>

        {/* 소셜 로그인 */}
        <div className="flex justify-between items-center mt-[2.93vw]">
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

      <div>
        <Link to="/test">test</Link>
      </div>
    </div>
  );
}