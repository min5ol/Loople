// src/components/pages/NewPost.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../../apis/instance";
import usePresignedUpload from "../../hooks/usePresignedUpload";
import Header from "../templates/Header";
import { useAuthStore } from "../../store/authStore";

export const submitPost = async (postData, type) => {
  const res = await instance.post(`/community/post/submit/${type}`, postData);
  return res.data;
};

export default function NewPost() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    no: "",
    title: "",
    category: "",
    content: "",
    isFileChanged: false,
    attachedFile: null,
  });
  const { upload, isLoading, error } = usePresignedUpload();

  const location = useLocation();
  const post = location.state?.post;
  const [isEditMode, setIsEditMode] = useState(false);

  const [isFileChanged, setIsFileChanged] = useState(false);

  useEffect(() => {
    console.log("post", post);
    if (post != null) {
      setIsEditMode(true);
      setFormData({
        title: post.title || "",
        category: post.category || "",
        content: post.content || "",
        attachedFile: null, // 수정 시 기존 파일 보여주려면 추가 처리 필요
      });
    }
  }, [post]);

  const CustomDropdown = ({ selected, onSelect }) => {
    const categories = [
      { type: "FREE", label: "자유 게시글" },
      { type: "USED", label: "중고 나눔 게시글" },
    ];

    const categoryMap = {
      FREE: "자유 게시글",
      USED: "중고 나눔 게시글",
    };

    return (
      <div className="relative w-full">
        <span
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          className="block border border-[#6e9b72] border-solid rounded p-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#20583e] select-none text-[#202020] bg-white text-sm"
        >
          {categoryMap[selected] || "카테고리 선택"}
        </span>

        {isOpen && (
          <div className="absolute z-20 w-full bg-white rounded shadow-md text-sm top-13">
            {categories.map((cat) => (
              <p
                key={cat.type}
                onClick={() => {
                  onSelect(cat.type);
                  setIsOpen(false);
                }}
                className="p-3 m-0 cursor-pointer list-none hover:bg-[#6e9b72] hover:text-white rounded"
              >
                {cat.label}
              </p>

            ))}
          </div>
        )}
      </div>
    );
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
      alert("제목, 카테고리, 내용을 모두 입력해주세요.");
      return;
    }

    const data = new FormData();
    data.append("no", post?.no || "");
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("content", formData.content);
    data.append("isFileChanged", isFileChanged);

    if (isFileChanged && formData.attachedFile) {
      try {
        const attachedFileUrl = await upload(formData.attachedFile);
        data.append("attachedFile", attachedFileUrl);
      } catch {
        console.log("첨부파일 업로드 실패");
        return;
      }
    }

    try {
      let type;
      isEditMode ? type = "update" : type = "create";
      const post = await submitPost(data, type);
      navigate("/communityPost", {
        state: { post },
      });

      console.log("성공", post);
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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F6F6]">
        <form onSubmit={handlePost} className="w-full max-w-5xl min-h-[600px] p-6 bg-white rounded-lg shadow-md text-base flex justify-center items-center">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="p-3 font-semibold text-[#20583e] border-r border-[#6e9b72] w-28">
                  제목 <span className="text-[#dc9847]">*</span>
                </td>
                <td className="p-3 m-0">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(false)}
                    className="text-[#202020] text-[14px] font-[Noto_Sans_KR] w-full p-3 border border-[#6e9b72] border-solid rounded focus:outline-none focus:ring-2 focus:ring-[#20583e] box-border"
                    placeholder="제목을 입력하세요"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#20583e] border-r border-[#6e9b72]">
                  카테고리 <span className="text-[#dc9847]">*</span>
                </td>
                <td className="p-3">
                  <CustomDropdown
                    selected={formData.category}
                    onSelect={(type) =>
                      setFormData((prev) => ({ ...prev, category: type }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="pt-3 px-3 font-semibold text-[#20583e] border-b border-[#6e9b72]"
                >
                  내용 <span className="text-[#dc9847]">*</span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-3">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(false)}
                    rows="6"
                    className="w-full p-3 text-[14px] font-[Noto-Sans-KR] text-[#202020] border border-[#6e9b72] rounded focus:outline-none focus:ring-2 focus:ring-[#20583e] box-border resize-none"
                    placeholder="내용을 입력하세요"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#20583e] border-r border-[#6e9b72]">
                  첨부파일
                </td>
                <td className="p-3">
                  <input
                    type="file"
                    name="attachedFile"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        attachedFile: e.target.files[0],
                      }));
                      setIsFileChanged(true);
                    }}
                    className="w-full text-[#202020]"
                    accept="image/*,.pdf,.hwp,.doc,.docx,.xls,.xlsx,.txt"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-3 text-center">
                  <input
                    type="submit"
                    value={
                      isLoading
                        ? "처리 중..."
                        : isEditMode
                          ? "수정하기"
                          : "등록하기"
                    }
                    disabled={isLoading}
                    className={`cursor-pointer w-full max-w-xs py-3 rounded-lg font-semibold text-white text-base border-none transition-colors ${isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#20583e] hover:bg-[#6e9b72]"
                      }`}
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
      </div>
    </>
  );

}
