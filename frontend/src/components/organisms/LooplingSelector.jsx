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
    if (!selected) {
      alert("루플링을 선택해주세요!");
      return;
    }
    onSelect?.(selected.id);
    requestAnimationFrame(() => onConfirm?.());
  };

  return (
    <div
      className="
        w-full max-w-3xl
        rounded-2xl p-6 sm:p-8
        bg-white/80 backdrop-blur-md
        ring-1 ring-black/5
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_12px_28px_rgba(0,0,0,0.10)]
      "
    >
      {/* 헤더 */}
      <div className="mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-ptd-700 text-brand-ink">
          {name}님과 함께할 루플링을 골라주세요
        </h2>
        <p className="text-xs sm:text-sm text-brand-ink/60 mt-1">
          선택 후에도 다른 루플링을 모을 수 있어요 ✨
        </p>
      </div>

      {/* 옵션 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {looplingOptions.map((l) => {
          const isSelected = selectedId === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedId(l.id)}
              aria-pressed={isSelected}
              className={[
                "group relative w-full rounded-2xl p-3 sm:p-4 text-left",
                "bg-white ring-1 ring-black/5 hover:ring-brand-300 transition",
                "shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                isSelected ? "ring-2 !ring-brand-600" : "",
              ].join(" ")}
            >
              {isSelected && (
                <span
                  className="
                    absolute top-2 right-2 z-10
                    text-[10px] px-2 py-1 rounded-full
                    bg-brand-600 text-white
                    shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  "
                >
                  선택됨
                </span>
              )}

              <div className="h-28 sm:h-32 w-full flex items-center justify-center">
                <img
                  src={l.imageUrl}
                  alt={l.name}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>

              <p
                className={[
                  "mt-3 h-6 text-center text-sm font-ptd-600",
                  isSelected ? "text-brand-600" : "text-brand-ink",
                ].join(" ")}
              >
                {l.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* 하단 바 */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
        {/* 선택 상태 미리보기 */}
        <div
          className="
            flex-1 rounded-xl p-4
            bg-brand-50
            ring-1 ring-black/5
            shadow-inner
            flex items-center gap-4
          "
        >
          <div
            className="
              w-14 h-14 rounded-lg bg-white
              ring-1 ring-black/5 shadow-inner
              flex items-center justify-center
            "
          >
            {selected ? (
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="max-h-10 object-contain"
              />
            ) : (
              <span className="text-[11px] text-brand-ink/40">미선택</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-brand-ink/60">선택한 루플링</p>
            <p className="text-sm font-ptd-700 text-brand-ink">
              {selected ? selected.name : "아직 선택하지 않았어요"}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="w-full sm:w-56 flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !selected}
            className={[
              "flex-1 h-12 rounded-xl font-ptd-700 text-white transition",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_12px_rgba(0,0,0,0.12)]",
              loading || !selected
                ? "bg-brand-300 cursor-not-allowed"
                : "bg-brand-600 hover:bg-brand-500",
            ].join(" ")}
          >
            {loading ? "지급 중..." : "선택 완료"}
          </button>

          <button
            type="button"
            onClick={() => setSelectedId(null)}
            disabled={loading}
            className="
              h-12 px-4 rounded-xl font-ptd-700
              bg-brand-100 text-brand-ink
              ring-1 ring-black/5
              shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
              hover:bg-brand-50 transition
              disabled:opacity-60
            "
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
