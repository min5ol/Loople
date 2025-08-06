import React, { useState } from "react";
import Header from "../templates/Header";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

const submitReport = async (formData) => {
  const res = await instance.post("/community/reports", formData);
  return res.data;
};

export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const target = location.state;
  const [formData, setFormData] = useState({
    target: target.target,
    targetId: target.targetId,
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
      <div className="pt-20 px-6 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
          <table className="w-full table-fixed border border-gray-300">
            <tbody>
              <tr>
                <td className="p-3 font-semibold text-[#264D3D] border-r border-[#749E89] w-28">신고 대상</td>
                <td className="py-2 px-3 select-none text-[#264D3D] bg-white focus:ring-2 focus:ring-[#3C9A5F] text-base">
                  {target.target == "post" ? "게시글" : "댓글"}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#264D3D] border-r border-[#749E89] w-28">신고 사유 <span className="text-red-500">*</span></td>
                <td><CustomDropdown /></td>
              </tr>
              <tr>
                <td colSpan={2} className="p-3 font-semibold text-[#264D3D] border-r border-[#749E89] w-28">상세 사유 <span className="text-red-500">*</span></td>
              </tr>
              <tr>
                <td colSpan={2} className="px-4 pb-4">
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    rows={5}
                    className="w-full px-3 py-2 border border-[#81C784] rounded focus:outline-none focus:ring-2 focus:ring-[#3C9A5F] box-border resize-none"
                    placeholder="상세한 신고 사유를 입력해 주세요."
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center px-4 py-2">
                  <button type="submit" className="bg-[#3C9A5F] text-[#FEF7E2] px-5 py-2 rounded hover:bg-[#264D3D] transition-colors whitespace-nowrap border-none">
                    제출
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        {reportResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
              <h2 className="text-lg font-semibold text-green-600 mb-4">신고가 정상적으로 이루어졌습니다.</h2>
              <button className="bg-[#3C9A5F] text-[#FEF7E2] px-5 py-2 rounded hover:bg-[#264D3D] transition-colors whitespace-nowrap border-none" onClick={() => {
                setReportResult(false);
                navigate("/loopleHome");
              }}>
                확인
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
