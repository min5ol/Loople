// 작성일: 2025.07.28
// 작성자: 장민솔
// 설명: 회원가입 지급 완료 후 최종 응원 메시지 모달

// src/components/atoms/FinalSuccessModal.jsx

import React from "react";

export default function FinalSuccessModal({ name, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm text-center space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold text-[#264D3D]">
          {name}님, 축하드립니다! 🎉
        </h2>
        <p className="text-[#444] font-medium">
          앞으로 순환경제를 실천하실 {name}님의 하루하루를 응원합니다.
        </p>
        <button
          onClick={onConfirm}
          className="mt-4 w-full bg-primary text-white py-3 rounded-lg hover:bg-[#2f7b4d] transition font-semibold"
        >
          대시보드로 가기
        </button>
      </div>
    </div>
  );
}