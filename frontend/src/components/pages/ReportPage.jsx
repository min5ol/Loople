// src/components/pages/ReportPage.jsx

import React, { useState } from "react";
import Header from "../templates/Header";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import { useAuthStore } from "../../store/authStore";

const submitReport = async (formData) => {
  const res = await instance.post("/community/reports", formData);
  return res.data;
};

export default function ReportPage() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { target, targetId } = location.state;
  const [formData, setFormData] = useState({
    target: target,
    targetId: targetId,
    category: "",
    reason: ""
  });
  const [reportResult, setReportResult] = useState(false);

  const CustomDropdown = () => {
    const categories = ["스팸/광고", "욕설/비방", "음란물", "개인정보 노출", "허위사실", "기타"];
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(formData.category);

    return (
      <div className="relative">
        <div
          onClick={() => setIsShowDropdown(!isShowDropdown)}
          className="block border border-[#81C784] border-solid rounded py-2 px-3 cursor-pointer select-none text-[#264D3D] bg-white focus:ring-2 focus:ring-[#3C9A5F] text-base"
        >
          {selectedCategory || "신고 사유"}
        </div>
        {isShowDropdown && (
          <div className="absolute z-20 w-full bg-white border border-[#81C784] rounded mt-1 shadow-md text-base">
            {categories.map((category, idx) => (
              <p
                key={idx}
                onClick={() => {
                  setFormData(prev => ({ ...prev, category }));
                  setSelectedCategory(category);
                  setIsShowDropdown(false);
                }}
                className="px-3 py-2 cursor-pointer"
              >
                {category}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("신고 사유를 선택해 주세요.");
      return;
    }

    if (!formData.reason.trim()) {
      alert("상세 사유를 입력해 주세요.");
      return;
    }

    try {
      await submitReport(formData);
      setReportResult(true);
    } catch (error) {
      console.log(error);
      setReportResult(false);
    }
  };

return (
  <>
    <Header />

    <div className="pt-20 px-6">
      <form
        onSubmit={handleSubmit}
        className="
          max-w-xl mx-auto
          rounded-2xl px-6 py-7
          bg-white/85 backdrop-blur-md
          ring-1 ring-black/5
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_12px_28px_rgba(0,0,0,0.10)]
          space-y-6
        "
      >
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-ptd-700 text-brand-ink">신고하기</h1>
          <p className="mt-1 text-sm text-brand-ink/65">
            커뮤니티 안전을 위해 소중한 제보를 보내주세요.
          </p>
        </div>

        {/* 신고 대상 */}
        <div>
          <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">
            신고 대상
          </label>
          <div className="h-11 px-4 rounded-lg bg-brand-50 ring-1 ring-black/10 grid place-items-center text-brand-ink">
            {target === "post" ? "게시글" : "댓글"}
          </div>
        </div>

        {/* 신고 사유 */}
        <div>
          <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">
            신고 사유 <span className="text-[#EF4444]">*</span>
          </label>
          <CustomDropdown />
        </div>

        {/* 상세 사유 */}
        <div>
          <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">
            상세 사유 <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            rows={6}
            placeholder="상세한 신고 사유를 입력해 주세요."
            className="
              w-full px-4 py-3 rounded-lg
              bg-white placeholder-black/40
              ring-1 ring-brand-300 focus:outline-none focus:ring-4
              shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]
              resize-none
              text-brand-ink
            "
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="
              h-11 px-6 rounded-lg
              bg-brand-600 text-white font-ptd-700
              shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.12)]
              hover:bg-brand-500 transition
            "
          >
            제출
          </button>
        </div>
      </form>
    </div>

    {/* 신고 완료 모달 */}
    {reportResult && (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div className="w-[88%] max-w-sm rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-2xl text-center">
          <h2 className="text-lg font-ptd-700 text-brand-ink">
            신고가 정상적으로 접수되었습니다.
          </h2>
          <p className="mt-2 text-sm text-brand-ink/70">
            검토 후 필요 시 추가 조치를 진행합니다.
          </p>
          <button
            className="
              mt-5 h-10 px-5 rounded-lg
              bg-brand-600 text-white font-ptd-600
              hover:bg-brand-500 transition
            "
            onClick={() => {
              setReportResult(false);
              navigate("/loopleHome");
            }}
          >
            확인
          </button>
        </div>
      </div>
    )}
  </>
);

}
