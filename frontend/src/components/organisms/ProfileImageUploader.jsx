// 작성일: 2025.07.16
// 작성자: 장민솔
// 기능설명: 사용자가 이미지 파일을 선택하면 모달에서 자를 수 있게 하고, 자른 이미지 파일을 presigned URL을 통해 업로드한 후, URL을 상위 컴포넌트에 넘김

import React, { useState } from "react";
import CropModal from "../atoms/CropModal";
import usePresignedUpload from "../../hooks/usePresignedUpload";

export default function ProfileImageUploader({ onUpload }) {
  const [originalFile, setOriginalFile] = useState(null);     // 사용자가 선택한 원본 이미지 파일
  const [isCropping, setIsCropping] = useState(false);        // 이미지 자르기 모달 표시 여부

  // 업로드 훅: 파일 업로드 함수 + 로딩/에러 상태 같이 받아옴
  const { upload, isLoading, error } = usePresignedUpload();

  // 파일 선택됐을 때 실행되는 함수
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setOriginalFile(selectedFile); // 원본 파일 저장
      setIsCropping(true);           // 모달 열기
    }
  };

  // 자르기 완료 시 실행됨. 잘린 Blob을 받아서 업로드 처리함
  const handleCropDone = async (croppedBlob) => {
    setIsCropping(false);
    if (!croppedBlob) return;

    // Blob을 File 객체로 다시 감싸서 업로드
    const croppedFile = new File([croppedBlob], originalFile.name, {
      type: "image/jpeg",
    });

    try {
      const url = await upload(croppedFile); // presigned URL 이용해 업로드
      onUpload(url);                          // 업로드된 이미지 URL 부모 컴포넌트에 넘김
    } catch (err) {
      // 에러는 훅 내부에서 이미 잡히지만, 필요 시 alert 등 추가 가능
      console.error("이미지 업로드 실패", err);
    }
  };

  // 모달 닫을 때 실행됨. 상태 초기화
  const handleCloseModal = () => {
    setIsCropping(false);
    setOriginalFile(null);
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">프로필 이미지</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading} // 업로드 중이면 파일 선택 막음
          className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </label>

      {/* 업로드 중일 때 안내 메시지 */}
      {isLoading && <p className="text-sm text-gray-600">이미지를 업로드하는 중입니다...</p>}

      {/* 에러 났을 때 메시지 표시 */}
      {error && <p className="text-sm text-red-600">업로드 실패: {error.message}</p>}

      {/* 자르기 모달 열릴 때 */}
      {isCropping && originalFile && (
        <CropModal
          file={originalFile}
          onDone={handleCropDone}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}