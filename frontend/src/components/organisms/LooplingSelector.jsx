// src/components/organisms/LooplingSelector.jsx
import React, { useMemo, useState } from "react";
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
  const selected = useMemo(
    () => looplingOptions.find((o) => o.id === selectedId) || null,
    [selectedId]
  );

  const handleConfirm = () => {
    // 객체 기준으로 체크 (state 경쟁 방지)
    if (!selected) {
      alert("루플링을 선택해주세요!");
      return;
    }
    // 부모 상태 반영
    onSelect?.(selected.id);
    // 다음 프레임에 confirm (리렌더/리마운트 경쟁 회피)
    requestAnimationFrame(() => onConfirm?.());
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-3xl w-full">
      <div className="mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[#264D3D]">
          {name}님과 함께할 루플링을 골라주세요
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">선택 후에도 다른 루플링을 모을 수 있어요 ✨</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch auto-rows-fr">
        {looplingOptions.map((l) => {
          const isSelected = selectedId === l.id;
          return (
            <button
              type="button"
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              aria-pressed={isSelected}
              className={[
                "relative rounded-2xl bg-white h-full p-3 sm:p-4 text-left",
                "border border-[#E5E7EB] hover:border-[#C7D8CD] transition-shadow",
                isSelected ? "ring-2 ring-[#3C9A5F] ring-offset-0" : "ring-0",
                "shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#81C784]",
              ].join(" ")}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 z-10 text-[10px] px-2 py-1 rounded-full bg-[#3C9A5F] text-white shadow">
                  선택됨
                </span>
              )}
              <div className="h-28 sm:h-32 w-full flex items-center justify-center">
                <img src={l.imageUrl} alt={l.name} className="max-h-full max-w-full object-contain" />
              </div>
              <p className={`mt-3 h-6 text-center text-sm font-semibold ${isSelected ? "text-[#3C9A5F]" : "text-[#202020]"}`}>
                {l.name}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1 rounded-xl bg-[#F6F6F6] p-4 flex items-center gap-4 shadow-inner shadow-[inset_0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center shadow-inner shadow-[inset_0_3px_8px_rgba(0,0,0,0.08)]">
            {selected ? (
              <img src={selected.imageUrl} alt={selected.name} className="max-h-10 object-contain" />
            ) : (
              <span className="text-xs text-[#9CA3AF]">미선택</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#6B7280]">선택한 루플링</p>
            <p className="text-sm font-semibold">{selected ? selected.name : "아직 선택하지 않았어요"}</p>
          </div>
        </div>

        <div className="w-full sm:w-56 flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !selected}
            className={[
              "flex-1 h-12 rounded-2xl font-semibold transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#81C784]",
              "shadow-inner shadow-[inset_0_6px_14px_rgba(0,0,0,0.12)]",
              loading || !selected
                ? "bg-gradient-to-b from-[#A7D7B0] to-[#81C784] text-white opacity-70 cursor-not-allowed"
                : "bg-gradient-to-b from-[#3C9A5F] to-[#2f7b4d] text-white hover:brightness-[1.05] active:translate-y-[1px]",
            ].join(" ")}
          >
            {loading ? "지급 중..." : "선택 완료"}
          </button>

          <button
            type="button"
            onClick={() => setSelectedId(null)}
            disabled={loading}
            className={[
              "h-12 px-4 rounded-2xl font-semibold transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#81C784]",
              "bg-[#FEF7E2] text-[#264D3D] shadow-inner shadow-[inset_0_6px_14px_rgba(0,0,0,0.08)]",
              "hover:bg-[#F6F6F6] active:translate-y-[1px] disabled:opacity-60",
            ].join(" ")}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
