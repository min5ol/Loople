// 작성일: 2025.07.16
// 작성자: 장민솔
// 설명: 회원가입 1단계. 이메일, 비밀번호, 비밀번호 확인을 입력받고 검증 후 세션스토리지에 저장하고 다음 단계로 이동

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpStep1() {
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // 인풋 입력 바뀔 때마다 form 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 다음 버튼 눌렀을 때
  const handleNext = () => {
    // 빈값 검사
    if (!form.email || !form.password || !form.passwordConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 비밀번호 일치 여부 확인
    if (form.password !== form.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 1단계 입력값 세션스토리지에 저장
    sessionStorage.setItem("signupStep1", JSON.stringify(form));

    // 2단계로 이동
    navigate("/signup/step2");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F6F6F6]">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">이메일로 시작하기</h2>

        {/* 이메일/비밀번호 입력 필드 */}
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          className="w-full mt-6 bg-[#3C9A5F] text-white py-3 rounded hover:bg-[#2f7b4d]"
        >
          다음
        </button>
      </div>
    </div>
  );
}