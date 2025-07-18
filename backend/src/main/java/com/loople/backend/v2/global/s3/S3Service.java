/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: S3 Presigned URL 생성 로직을 담당하는 서비스 클래스
 */

package com.loople.backend.v2.global.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * 주어진 파일명과 contentType에 대해 5분 유효한 PUT presigned URL을 생성한다.
     * @param fileName 업로드할 파일 이름 (예: user123/profile.png)
     * @param contentType 파일의 MIME 타입 (예: image/png)
     * @return 생성된 presigned URL
     */
    public String createPresignedUrl(String fileName, String contentType) {
        log.info("[S3] Presigned URL 생성 요청: fileName={}, contentType={}", fileName, contentType);

        // 유효 시간: 현재로부터 5분
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 5);

        // presigned URL 요청 객체 생성
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, fileName)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration);
        request.setContentType(contentType);

        // URL 생성
        URL url = amazonS3.generatePresignedUrl(request);

        log.info("[S3] Presigned URL 생성 완료: {}", url);
        return url.toString();
    }
}