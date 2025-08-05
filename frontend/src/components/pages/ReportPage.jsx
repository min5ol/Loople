import React, { useState } from "react";
import Header from "../templates/Header";
import { useLocation } from "react-router-dom";

export default function ReportPage() {
  const location = useLocation();
  const target = location.state;

  const [formData, setFormData] = useState({
    targetId: target.targetId,
    target: target.target,
    category: "",
    reason: ""
  });

  console.log(location.state.target);
  console.log(location.state.targetId);

  const CustomDropdown = () => {
    const categorys = ["스팸/광고", "욕설/비방", "음란물", "개인정보 노출", "허위사실", "기타"];
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(formData.category);

    return (
      <div className="relative">
        <p onClick={() => setIsShowDropdown(!isShowDropdown)} className="cursor-pointer bg-white">
          {selectedCategory || "신고 사유"}
        </p>
        {isShowDropdown && (
          <div className="absolute bg-white">
            {categorys.map((category, idx) => (
              <p name="category" key={idx} value={category} onClick={(e) => {
                setFormData(prev => ({ ...prev, category }));
                setSelectedCategory(category);
                setIsShowDropdown(false);
              }} className="cursor-pointer">
                {category}
              </p>
            ))}
          </div>
        )}

      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <>
      <Header />
      <div className="pt-14 px-4"> {/* pt-14 = padding-top: 3.5rem = 56px */}
        <form onSubmit={handleSubmit}>
          <table border="1">
            <tbody>
              <tr>
                <td>신고대상</td>
                <td>{target.target}</td>
              </tr>
              <tr>
                <td>신고사유</td>
                <td><CustomDropdown /></td>
              </tr>
              <tr>
                <td colSpan={2}>상세 사유</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <textarea
                    name="reason"
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}><button type="submit">제출</button></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
}