/**
 * S3 Presigned URL 생성 서비스
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

/**
 * Presigned URL 발급 로직 처리
 */
@Service
@RequiredArgsConstructor
public class PresignedUrlService {

    private final AmazonS3 amazonS3; // S3 클라이언트

    @Value("${cloud.aws.s3.bucket}")
    private String bucket; // S3 버킷명

    /**
     * Presigned URL 생성
     * @param fileName - 업로드할 파일명
     * @return 업로드 가능한 Presigned URL 문자열
     */
    public String generatePresignedUrl(String fileName) {
        Date expiration = new Date();
        long expTimeMills = expiration.getTime() + 1000 * 60 * 5; // 만료시간: 5분 설정
        expiration.setTime(expTimeMills);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName)
                .withMethod(HttpMethod.PUT) // PUT 방식
                .withExpiration(expiration); // 만료시간 설정

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest); // Presigned URL 생성 요청

        return url.toString(); // URL 문자열 반환
    }
}
