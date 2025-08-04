import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CommunityPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const res = location.state.res;
  console.log(res);

  // 확장자 추출 helper 함수
  const getFileExtension = (filename) => {
    return filename?.split('.').pop().toLowerCase();
  };

  // 이미지 파일인지 체크
  const isImageFile = (filename) => {
    const ext = getFileExtension(filename);
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
  };

  // 문서 파일인지 체크 (필요하면 hwp 등도 추가 가능)
  const isDocumentFile = (filename) => {
    const ext = getFileExtension(filename);
    return ["pdf", "hwp", "doc", "docx", "xls", "xlsx", "txt"].includes(ext);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-[#F6F6F6] shadow-lg rounded-lg border border-[#81C784]">
      <h2 className="text-3xl font-bold text-[#264D3D] mb-4">{res.title}</h2>

      <div className="flex justify-between text-sm text-[#3C9A5F] mb-2">
        <span>
          작성자: <span className="font-semibold">{res.nickname}</span>
        </span>
        {res.category === "USED" && (
          <button
            className="bg-[#3C9A5F] text-[#FEF7E2] px-3 py-1 rounded hover:bg-[#264D3D] transition-colors"
          >
            작성자와 채팅하기
          </button>
        )}
      </div>

      <div className="text-xs text-[#749E89] mb-4">
        작성일: {new Date(res.createdAt).toLocaleString()}
      </div>

      <p className="text-[#202020] leading-relaxed whitespace-pre-wrap mb-6">
        {res.content}
      </p>

      {res.attachedFile && (
        <div className="mt-4">
          {isImageFile(res.attachedFile) ? (
            <img
              src={res.attachedFile}
              alt="첨부 이미지"
              className="max-w-full rounded-lg shadow-md border border-[#81C784]"
            />
          ) : isDocumentFile(res.attachedFile) ? (
            <a
              href={res.attachedFile}
              download
              className="text-[#3C9A5F] hover:underline font-medium"
              target="_blank" rel="noopener noreferrer"
            >
              첨부파일 다운로드
            </a>
          ) : (
            <span className="text-red-600 font-semibold">
              지원하지 않는 파일 형식입니다.
            </span>
          )}
        </div>
      )}

      <button
        onClick={() => navigate("/looplehome")}
        className="mt-8 w-full bg-[#81C784] text-[#FEF7E2] py-3 rounded-lg font-semibold hover:bg-[#264D3D] transition-colors"
      >
        홈으로 이동
      </button>
    </div>
  );
}
