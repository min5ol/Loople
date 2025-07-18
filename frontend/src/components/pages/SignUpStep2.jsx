import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpStep2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    phone: "",
  });

  useEffect(() => {
    const step1 = sessionStorage.getItem("signupStep1");
    if (!step1) {
      alert("1단계를 먼저 진행해주세요.");
      navigate("/signup/step1");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const simulatePASS = () => {
    const fakePhone = `010-1234-${Math.floor(1000 + Math.random() * 9000)}`;
    alert("PASS 인증 시뮬레이션 완료!");
    setForm((prev) => ({ ...prev, name: "홍길동", phone: fakePhone }));
  };

  const handleNext = () => {
    if (!form.name || !form.nickname || !form.phone) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    sessionStorage.setItem("signupStep2", JSON.stringify(form));
    navigate("/signup/step3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F6F6F6]">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">정보를 입력해주세요</h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            name="phone"
            placeholder="휴대폰번호"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <button
            onClick={simulatePASS}
            className="w-full mt-2 bg-[#81C784] text-white py-2 rounded hover:bg-[#749E89]"
          >
            PASS 인증 시뮬
          </button>
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