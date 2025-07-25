// 작성일: 2025-07-16
// 작성자: 장민솔
// 설명: 이미지 자르기 모달, 사용자가 올린 이미지를 자르도록 UI 제공 및 완료 후 Blob을 콜백으로 넘김

// src/components/atoms/CropModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/getCroppedImg";

export default function CropModal({ file, onDone, onClose }) {
  //file: 자르기 대상 원본 이미지 (File 객체)
  //onDone: 자르기 완료 후 호출하는 콜백 (Blob 전달)
  //onClose: 모달 닫기용 콜백

  const [imageUrl, setImageUrl] = useState(null); // 이미지 미리보기용 URL
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // 자르기 위치
  const [zoom, setZoom] = useState(1); // 줌 값
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // 실제 잘릴 영역 (px기준)

  // file 들어오면 FileReader로 미리보기 이미지 생성
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result); // base64로 바꿔서 표시
    reader.readAsDataURL(file);
  }, [file]);

  // 자르기 완료 시 잘린 영역 저장 (나중에 이 영역 기준으로 Blob 생성)
  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // 업로드 버튼 눌렀을 때 실제 자르기 처리
  const handleDone = async () => {
    try {
      // getCroppedImg는 base64 이미지랑 잘릴 영역을 받아서 Blob 만들어줌
      const blob = await getCroppedImg(imageUrl, croppedAreaPixels);

      // Blob 넘겨주고 모달 밖에서 업로드 진행
      onDone(blob);
    } catch (err) {
      console.error("자르기 실패", err);
      alert("이미지 자르기에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-[90%] max-w-xl">
        <h2 className="font-bold mb-4">이미지 자르기</h2>
        <div className="relative w-full h-80 bg-gray-100">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDone}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
}
