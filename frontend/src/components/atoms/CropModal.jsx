import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "../../styles/cropper.css";

export default function CropModal({ file, onCrop, onClose }) {
  const cropperRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  // 파일을 URL로 변환
  const readFile = () => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas({
      width: 300,
      height: 300,
    }).toBlob((blob) => {
      onCrop(blob);
    }, file.type || "image/jpeg");
  };

  React.useEffect(() => {
    if (file) readFile();
  }, [file]);

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
        <h2 className="text-lg font-bold mb-2">이미지 자르기</h2>
        <Cropper
          src={imageUrl}
          ref={cropperRef}
          style={{ height: 300, width: "100%" }}
          aspectRatio={1}
          guides={false}
          viewMode={1}
          dragMode="move"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>취소</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleCrop}>완료</button>
        </div>
      </div>
    </div>
  );
}