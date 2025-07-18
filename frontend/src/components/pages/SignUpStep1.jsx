import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpStep1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!form.email || !form.password || !form.passwordConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 임시 저장
    sessionStorage.setItem("signupStep1", JSON.stringify(form));
    navigate("/signup/step2");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F6F6F6]">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">이메일로 시작하기</h2>

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