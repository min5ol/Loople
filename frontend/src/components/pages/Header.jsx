import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full bg-[#F6F6F6] flex justify-center gap-6 py-3 border-b border-gray-300 shadow-md no-scrollbar whitespace-nowrap px-4">
      <button onClick={() => navigate("/loopleHome")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">Loople</button>
      <button onClick={() => navigate("/mypage")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">마이페이지</button>
      <button onClick={() => navigate("/myroom")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">마이룸</button>
      <button onClick={() => navigate("/myavatar")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">마이아바타</button>
      <button onClick={() => navigate("/myloopling")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">마이루플링</button>
      <button onClick={() => navigate("/myvillage")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">마이빌리지</button>
      <button onClick={() => navigate("/quiz")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">퀴즈 풀기</button>
      <button onClick={() => navigate("/rule")} className="text-sm text-[#264D3D] font-medium hover:underline px-3 py-1">지역별 규칙 조회</button>
    </div>

  )

}