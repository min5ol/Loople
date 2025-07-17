import React, { useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/getCroppedImg";

export default function CropModal({ file, onDone, onClose }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const blob = await getCroppedImg(imageUrl, croppedAreaPixels);
      onDone(blob); // 이건 이미지 업로드 쪽에서만 처리됨
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
