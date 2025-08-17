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
    const [isOpen, setIsOpen] = useState(false);

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
          onClick={() => setIsOpen(!isOpen)}
          className="block border border-[#81C784] border-solid rounded py-2 px-3 cursor-pointer select-none text-[#264D3D] bg-white focus:ring-2 focus:ring-[#3C9A5F] text-base"
        >
          {categoryMap[selected] || "카테고리 선택"}
        </span>

        {isOpen && (
          <div className="absolute z-20 w-full bg-white border border-[#81C784] rounded mt-1 shadow-md text-base">
            {categories.map((cat) => (
              <p
                key={cat.type}
                onClick={() => {
                  onSelect(cat.type);
                  setIsOpen(false);
                }}
                className="px-3 py-2 cursor-pointer list-none"
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

    <form
      onSubmit={handlePost}
      className="
        max-w-2xl mx-auto mt-20 px-6 py-7
        rounded-2xl
        bg-white/85 backdrop-blur-md
        ring-1 ring-black/5
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_12px_28px_rgba(0,0,0,0.10)]
      "
    >
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-ptd-700 text-brand-ink">
          {isEditMode ? "게시글 수정" : "새 게시글"}
        </h2>
        <p className="mt-1 text-sm text-brand-ink/60">
          커뮤니티 가이드에 맞춰 따듯한 소통을 해주세요 🌿
        </p>
      </div>

      {/* 제목 */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">
          제목 <span className="text-[#EF4444]">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          required
          className="
            ctl-input h-11
            shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]
            ring-1 ring-brand-300 focus:ring-4
          "
        />
      </div>

      {/* 카테고리 */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">
          카테고리 <span className="text-[#EF4444]">*</span>
        </label>
        <div className="relative">
          <CustomDropdown
            selected={formData.category}
            onSelect={(type) => setFormData((prev) => ({ ...prev, category: type }))}
          />
        </div>
      </div>

      {/* 내용 */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">
          내용 <span className="text-[#EF4444]">*</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="8"
          placeholder="내용을 입력하세요"
          required
          className="
            w-full px-4 py-3 rounded-lg
            bg-white placeholder-black/40
            ring-1 ring-brand-300 focus:outline-none focus:ring-4
            shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]
            resize-none
          "
        />
      </div>

      {/* 첨부파일 */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-ptd-600 text-brand-ink">첨부파일</label>
        <div
          className="
            w-full rounded-lg bg-brand-50
            ring-1 ring-black/5
            px-4 py-3
            flex items-center justify-between gap-3
          "
        >
          <input
            type="file"
            name="attachedFile"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, attachedFile: e.target.files[0] }));
              setIsFileChanged(true);
            }}
            className="flex-1 text-brand-ink text-sm file:mr-4 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-white file:cursor-pointer hover:file:bg-brand-500"
            accept="image/*,.pdf,.hwp,.doc,.docx,.xls,.xlsx,.txt"
          />
        </div>
      </div>

      {/* 제출 */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            h-11 px-4 rounded-lg
            bg-white text-brand-ink
            ring-1 ring-black/10
            hover:bg-brand-50 transition
          "
        >
          취소
        </button>

        <input
          type="submit"
          value={isLoading ? "처리 중..." : isEditMode ? "수정하기" : "등록하기"}
          disabled={isLoading}
          className={[
            "h-11 px-6 rounded-lg font-ptd-700 text-white cursor-pointer",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.12)]",
            isLoading
              ? "bg-brand-300 cursor-not-allowed"
              : "bg-brand-600 hover:bg-brand-500",
          ].join(" ")}
        />
      </div>

      {/* 에러 */}
      {error && (
        <p className="mt-4 text-center text-[#B91C1C] font-ptd-600">
          업로드 중 오류가 발생했습니다. 다시 시도해주세요.
        </p>
      )}
    </form>
  </>
);

}
