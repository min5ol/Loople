import React, { useState, useRef } from "react";
import CropModal from "../atoms/CropModal";
import usePresignedUpload from "../../hooks/usePresignedUpload";

export default function ProfileImageUploader({ onUpload }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef();
  const { uploadToS3 } = usePresignedUpload();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setCropModalOpen(true);
  };

  const handleCropComplete = async (croppedBlob) => {
    const uploadedUrl = await uploadToS3(croppedBlob, selectedFile.name, selectedFile.type);
    onUpload(uploadedUrl);
    setPreviewUrl(URL.createObjectURL(croppedBlob));
    setCropModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="프로필 미리보기" className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              + 사진
            </div>
          )}
        </div>
      </label>
      {isCropModalOpen && (
        <CropModal
          file={selectedFile}
          onCrop={handleCropComplete}
          onClose={() => setCropModalOpen(false)}
        />
      )}
    </div>
  );
}
