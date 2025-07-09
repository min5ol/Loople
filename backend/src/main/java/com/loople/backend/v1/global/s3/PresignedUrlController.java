/**
 * S3 Presigned URL 발급 컨트롤러
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * S3 Presigned URL 발급 역할
 */
@RestController
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class PresignedUrlController {

    private final PresignedUrlService presignedUrlService; // Presigned URL 생성 서비스

    /**
     * Presigned URL 생성 요청 처리
     * @param fileName - 업로드할 파일명
     * @return S3에 업로드 가능한 Presigned URL
     */
    @PostMapping("/presigned")
    public ResponseEntity<String> getPresignedUrl(@RequestParam String fileName) {
        String url = presignedUrlService.generatePresignedUrl(fileName); // Presigned URL 생성

        return ResponseEntity.ok(url); // 성공 응답 반환
    }
}
