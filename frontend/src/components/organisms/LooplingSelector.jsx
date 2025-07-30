// 작성일: 2025.07.28
// 작성자: 장민솔
// 설명: 루플링 선택 컴포넌트 - 기본 루플링 중 택1 선택 후 확인

// src/components/organisms/LooplingSelector.jsx

import React, { useState } from "react";
import loopling1 from "../../assets/loopling1.png";
import loopling2 from "../../assets/loopling2.png";
import loopling3 from "../../assets/loopling3.png";
import loopling4 from "../../assets/loopling4.png";
import loopling5 from "../../assets/loopling5.png";

const looplingOptions = [
  { id: 1, name: "종이 루플링", imageUrl: loopling1 },
  { id: 2, name: "건전지 루플링", imageUrl: loopling2 },
  { id: 3, name: "캔 루플링", imageUrl: loopling3 },
  { id: 4, name: "유리 루플링", imageUrl: loopling4 },
  { id: 5, name: "비닐 루플링", imageUrl: loopling5 },
];

export default function LooplingSelector({ name, onSelect, onConfirm, loading }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirm = () => {
    if (!selectedId) return alert("루플링을 선택해주세요!");
    onSelect(selectedId);
    onConfirm();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl text-center space-y-6 max-w-md w-full">
      <h2 className="text-xl font-bold text-[#264D3D]">
        {name}님과 함께 생활하게 될 루플링을 선택해주세요
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {looplingOptions.map((l) => (
          <div
            key={l.id}
            onClick={() => setSelectedId(l.id)}
            className={`cursor-pointer p-2 rounded-lg border-2 transition-all transform ${
              selectedId === l.id
                ? "border-[#3C9A5F] shadow-lg scale-105"
                : "border-gray-200"
            }`}
          >
            <img
              src={l.imageUrl}
              alt={l.name}
              className="w-20 h-20 object-contain mx-auto"
            />
            <p className="mt-1 text-sm font-medium">{l.name}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="mt-4 w-full bg-[#3C9A5F] text-white py-3 rounded-lg hover:bg-[#2f7b4d] transition font-semibold"
      >
        {loading ? "지급 중..." : "루플링 선택 완료"}
      </button>
    </div>
  );
}
