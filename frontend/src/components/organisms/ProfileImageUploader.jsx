import React, { useState } from "react";
import CropModal from "../atoms/CropModal";
import usePresignedUpload from "../../hooks/usePresignedUpload";

export default function ProfileImageUploader({ onUpload }) {
  const [originalFile, setOriginalFile] = useState(null); // 사용자가 선택한 원본 파일
  const [isCropping, setIsCropping] = useState(false); // 모달 표시 여부

  // 1. 훅에서 isLoading과 error 상태를 함께 가져옵니다.
  const { upload, isLoading, error } = usePresignedUpload();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setOriginalFile(selectedFile);
      setIsCropping(true);
    }
  };

  /**
   * 이미지 자르기가 완료되었을 때 실행되는 함수
   * @param {Blob} croppedBlob - 잘린 이미지 데이터
   */
  const handleCropDone = async (croppedBlob) => {
    setIsCropping(false);
    if (!croppedBlob) return;

    // 원본 파일 이름으로 새로운 File 객체 생성
    const croppedFile = new File([croppedBlob], originalFile.name, {
      type: "image/jpeg", // 크롭 라이브러리는 보통 jpeg나 png로 출력합니다.
    });

    try {
      const url = await upload(croppedFile);
      onUpload(url); // 업로드 성공 시 부모 컴포넌트로 URL 전달
    } catch (err) {
      // 에러는 usePresignedUpload 훅에서 이미 처리하고 상태에 저장됩니다.
      // 여기서는 추가적인 UI 피드백(alert 등)이 필요할 경우를 위해 남겨둘 수 있습니다.
      console.error("❌ 이미지 업로드에 최종 실패했습니다.", err);
    }
  };

  /**
   * 모달을 닫을 때 파일 상태를 초기화하는 함수
   */
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
          // 2. 업로드 중에는 파일 선택을 비활성화하여 중복 업로드를 방지합니다.
          disabled={isLoading}
          className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </label>

      {/* 3. 로딩 및 에러 상태에 따른 UI 피드백을 사용자에게 제공합니다. */}
      {isLoading && <p className="text-sm text-gray-600">이미지를 업로드하는 중입니다...</p>}
      {error && <p className="text-sm text-red-600">⚠️ 업로드 실패: {error.message}</p>}

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