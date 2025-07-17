import React from "react";

export default function SignupSuccessModal({ nickname, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4">{nickname}님, 안녕하세요!</h2>
        <p className="text-gray-600 mb-6">회원가입이 완료되었어요 🎉</p>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
