// 작성일: 2025.07.18
// 작성자: 장민솔
// 설명: 회원가입 1단계 – 이메일 중복 확인, 입력 검증, 디자인 완전 리팩토링 (box-sizing 적용 반영)

// src/components/pages/SignupStep1.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmail } from "../../apis/user";

export default function SignUpStep1() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [emailStatus, setEmailStatus] = useState({
    checked: false,
    message: "",
    isValid: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailStatus({ checked: false, message: "", isValid: false });
    }
  };

  const handleEmailCheck = async () => {
    if (!form.email) {
      setEmailStatus({
        checked: false,
        message: "이메일을 입력해주세요.",
        isValid: false,
      });
      return;
    }

    try {
      const res = await checkEmail(form.email);
      setEmailStatus({
        checked: true,
        message: res.available
          ? "✅ 사용 가능한 이메일입니다."
          : "❌ 이미 사용 중인 이메일입니다.",
        isValid: res.available,
      });
    } catch {
      setEmailStatus({
        checked: true,
        message: "오류가 발생했습니다. 다시 시도해주세요.",
        isValid: false,
      });
    }
  };

  const handleNext = () => {
    const { email, password, passwordConfirm } = form;

    if (!email || !password || !passwordConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (!emailStatus.checked || !emailStatus.isValid) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    sessionStorage.setItem("signupStep1", JSON.stringify(form));
    navigate("/signup/step2");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-w-ground font-ptd-400">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl box-border">
        <h2 className="text-2xl font-ptd-700 mb-8 text-b-ground">이메일로 시작하기</h2>

        <div className="space-y-5">
          {/* 이메일 + 중복 확인 */}
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              className="flex-1 h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className="w-[100px] h-12 px-2 rounded-lg bg-primary-light border-none text-white font-ptd-500 hover:bg-[#68b76a] transition-all shadow-inner"
            >
              중복 확인
            </button>
          </div>

          {emailStatus.message && (
            <p className={`text-sm px-1 ${emailStatus.isValid ? "text-green-600" : "text-red-500"}`}>
              {emailStatus.message}
            </p>
          )}

          {/* 비밀번호 입력 */}
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />

          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-lg border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-light font-ptd-400 bg-[#F9F9F9] placeholder-gray-400 box-border"
          />
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-full h-12 mt-8 bg-primary text-white rounded-lg hover:bg-[#2f7b4d] transition font-ptd-600 border-none shadow-inner"
        >
          다음
        </button>
      </div>
    </div>
  );
}