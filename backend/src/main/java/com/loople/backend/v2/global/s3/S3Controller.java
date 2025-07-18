/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 프론트엔드에서 S3 presigned URL을 요청할 수 있도록 처리하는 컨트롤러
 */

package com.loople.backend.v2.global.s3;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequestMapping("/api/v2/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    /**
     * 프론트엔드에서 요청한 파일명과 Content-Type에 대해 presigned URL을 생성해 반환
     * @param fileName 업로드할 파일명 (url-encoded)
     * @param contentType 파일의 MIME 타입
     * @return presigned URL (PUT 요청용)
     */
    @GetMapping("/presigned-url")
    public String getPresignedUrl(@RequestParam String fileName, @RequestParam String contentType) {
        String decodedFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
        log.info("[S3] presigned URL 요청: fileName={}, contentType={}", decodedFileName, contentType);

        String presignedUrl = s3Service.createPresignedUrl(decodedFileName, contentType);

        log.info("[S3] presigned URL 생성 완료");
        return presignedUrl;
    }
}
