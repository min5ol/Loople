import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import usePresignedUpload from "../../hooks/usePresignedUpload";
import Header from "./Header";

export const createPost = async (postData) => {
  const res = await instance.post("/community/create", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export default function NewPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    attachedFile: null,
  });
  const { upload, isLoading, error } = usePresignedUpload();

  const CustomDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const categories = [
      { type: "FREE", label: "자유 게시글" },
      { type: "USED", label: "중고 나눔 게시글" },
    ];

    return (
      <div className="relative w-full">
        <span onClick={() => setIsOpen(!isOpen)}
          className="block border border-[#81C784] border-solid rounded py-2 px-3 cursor-pointer select-none text-[#264D3D] bg-white focus:ring-2 focus:ring-[#3C9A5F] text-base">
          {formData.category === "FREE"
            ? "자유 게시글"
            : formData.category === "USED"
              ? "중고 나눔 게시글"
              : "카테고리 선택"}
        </span>

        {isOpen && (
          <div className="absolute z-20 w-full bg-white border border-[#81C784] rounded mt-1 shadow-md text-base">
            {categories.map((cat) => (
              <p key={cat.type} onClick={() => {
                setFormData((prev) => ({ ...prev, category: cat.type }));
                setIsOpen(false);
              }} className="px-3 py-2 cursor-pointer list-none">
                {cat.label}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
      alert("제목, 카테고리, 내용을 모두 입력해주세요.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("content", formData.content);

    if (formData.attachedFile) {
      try {
        const attachedFileUrl = await upload(formData.attachedFile);
        data.append("attachedFile", attachedFileUrl);
      } catch {
        console.log("첨부파일 업로드 실패");
        return;
      }
    }

    try {
      const res = await createPost(data);
      navigate("/communityPost", {
        state: { res },
      });

      console.log("성공", res);
    } catch (error) {
      console.log("오류", error);
      console.log("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />
        <form onSubmit={handleCreatePost} className="max-w-md mx-auto mt-10 p-6 bg-[#F6F6F6] rounded-lg shadow-md flex justify-center item-center text-base mt-20">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-[#749E89]">
                <td className="p-3 font-semibold text-[#264D3D] border-r border-[#749E89] w-28">제목</td>
                <td className="p-3 m-0">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#81C784] border-solid rounded focus:outline-none focus:ring-2 focus:ring-[#3C9A5F] box-border"
                    placeholder="제목을 입력하세요"
                    required
                  />
                </td>
              </tr>
              <tr className="border-b border-[#749E89]">
                <td className="p-3 font-semibold text-[#264D3D] border-r border-[#749E89]">카테고리</td>
                <td className="p-3">
                  <CustomDropdown />
                </td>
              </tr>
              <tr className="border-b border-[#749E89]">
                <td
                  colSpan={2}
                  className="pt-3 px-3 font-semibold text-[#264D3D] border-b border-[#749E89]"
                >
                  내용
                </td>
              </tr>
              <tr className="border-b border-[#749E89]">
                <td colSpan={2} className="p-3">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-[#81C784] rounded focus:outline-none focus:ring-2 focus:ring-[#3C9A5F] box-border resize-none"
                    placeholder="내용을 입력하세요"
                    required
                  />
                </td>
              </tr>
              <tr className="border-b border-[#749E89]">
                <td className="p-3 font-semibold text-[#264D3D] border-r border-[#749E89]">첨부파일</td>
                <td className="p-3">
                  <input
                    type="file"
                    name="attachedFile"
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, attachedFile: e.target.files[0] }))
                    }
                    className="w-full text-[#202020]"
                    accept="image/*,.pdf,.hwp,.doc,.docx,.xls,.xlsx,.txt"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-3 text-center">
                  <input
                    type="submit"
                    value={isLoading ? "등록 중..." : "등록하기"}
                    disabled={isLoading}
                    className={`cursor-pointer w-full max-w-xs py-3 rounded-lg font-semibold text-[#FEF7E2] text-base ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#3C9A5F] hover:bg-[#264D3D]"
                      } transition-colors`}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {error && (
            <p className="text-red-600 text-center font-medium mt-3">
              업로드 중 오류가 발생했습니다. 다시 시도해주세요.
            </p>
          )}
        </form>
    </>
  );
}
