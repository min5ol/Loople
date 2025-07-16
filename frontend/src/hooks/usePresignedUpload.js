import axios from 'axios';
import instance from '../apis/instance';

/**
 * S3에 presigned URL을 이용해 파일 업로드하고, 최종 URL 반환
 * @returns upload(file): Promise<string>
 */
const usePresignedUpload = () => {
  const upload = async (file) => {
    try {
      // 1. presigned URL 요청
      const { data: presignedUrl } = await instance.get('/s3/presigned-url', {
        params: {
          fileName: encodeURIComponent(file.name),
          contentType: file.type
        }
      });

      // 2. 해당 URL로 PUT 요청
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type }
      });

      // 3. S3 최종 접근 가능한 URL 리턴
      return presignedUrl.split('?')[0];
    } catch (error) {
      console.error('🚨 presigned 업로드 실패:', error);
      throw error;
    }
  };

  return { upload };
};

export default usePresignedUpload;