// src/components/modals/SignupSuccessModal.jsx
import React from "react";

export default function SignupSuccessModal({ isOpen, name, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-[#264D3D]">{name}님, 회원가입에 성공했어요!</h2>
        <p className="text-[#444] font-medium">
          지금부터 루플에서 필요한 몇 가지 물품들을 지급할게요!
        </p>
        <button
          onClick={onConfirm}
          className="mt-4 bg-primary text-white py-2 px-6 rounded-lg hover:bg-[#2f7b4d] transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}
