package com.loople.backend.v2.global.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String createPresignedUrl(String fileName, String contentType) {
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 5); // 5분

        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, fileName)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration);

        // ✅ Content-Type 서명에 포함
        request.setContentType(contentType);

        // ❌ ACL 생략: 프론트에서도 안 보내고, 서명에도 포함 안 시킴
        URL url = amazonS3.generatePresignedUrl(request);
        return url.toString();
    }
}
