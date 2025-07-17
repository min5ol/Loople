import { useState } from "react";
import axios from "axios";
import instance from "../apis/instance";

/**
 * 파일 이름을 기반으로 S3에 저장될 고유한 파일 이름을 생성합니다.
 * @param {string} originalName - 원본 파일 이름
 * @returns {string} - 'loople-타임스탬프.확장자' 형식의 안전한 파일 이름
 */
function sanitizeFileName(originalName) {
  const extension = originalName.split(".").pop();
  const timestamp = Date.now();
  return extension ? `loople-${timestamp}.${extension}` : `loople-${timestamp}`;
}

/**
 * 파일을 S3 pre-signed URL을 통해 업로드하는 React Hook입니다.
 * @returns {{ upload: function, isLoading: boolean, error: object|null }}
 */
const usePresignedUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const safeFileName = sanitizeFileName(file.name);

      // 1. 백엔드에서 presigned URL 발급 요청
      const { data: presignedUrl } = await instance.get("/s3/presigned-url", {
        params: {
          fileName: safeFileName,
          contentType: file.type,
        },
      });

      // 2. 해당 URL로 파일 업로드 (ACL 없이 Content-Type만 포함)
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type, // ✅ 이것만 필요
        },
      });

      return presignedUrl.split("?")[0]; // 파일 URL 반환
    } catch (err) {
      console.error("🚨 presigned 업로드 실패:", err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading, error };
};

export default usePresignedUpload;
