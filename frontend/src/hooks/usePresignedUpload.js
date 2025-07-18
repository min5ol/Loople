// 작성일: 2025.07.16
// 작성자: 장민솔
// 설명: S3 presigned URL을 사용해서 이미지 파일을 업로드하는 커스텀 훅.
//       파일명을 안전하게 만들어서 백엔드에서 업로드 URL을 받아오고,
//       해당 URL로 직접 S3에 PUT 요청을 보냄.

import { useState } from "react";
import axios from "axios";
import instance from "../apis/instance";

/**
 * 파일 이름을 안전한 형식으로 변환
 * 예: 'loople-1710846120000.jpg' 이런 식
 */
function sanitizeFileName(originalName) {
  const extension = originalName.split(".").pop();
  const timestamp = Date.now();
  return extension ? `loople-${timestamp}.${extension}` : `loople-${timestamp}`;
}

/**
 * S3 presigned URL을 통한 이미지 업로드 훅
 * @returns { upload, isLoading, error }
 */
const usePresignedUpload = () => {
  const [isLoading, setIsLoading] = useState(false); // 업로드 중 상태
  const [error, setError] = useState(null);          // 에러 정보 저장

  const upload = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 백엔드에 presigned URL 발급 요청
      const safeFileName = sanitizeFileName(file.name);

      const { data: presignedUrl } = await instance.get("/s3/presigned-url", {
        params: {
          fileName: safeFileName,
          contentType: file.type,
        },
      });

      // 2. 해당 URL로 PUT 요청 보내서 파일 업로드
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type, // S3는 이 header만 필요함
        },
      });

      // 3. 쿼리스트링 제거하고 실제 파일 URL만 반환
      return presignedUrl.split("?")[0];
    } catch (err) {
      console.error("presigned 업로드 실패", err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading, error };
};

export default usePresignedUpload;