/**
 * AWS S3 설정 클래스
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.s3;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AWS S3 클라이언트 설정 등록
 */
@Configuration
@RequiredArgsConstructor
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey; // AWS 액세스 키

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey; // AWS 시크릿 키

    @Value("${cloud.aws.region.static}")
    private String region; // S3 리전

    /**
     * S3 클라이언트 Bean 등록
     * @return AmazonS3 객체
     */
    @Bean
    public AmazonS3 amazonS3() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey); // 자격 증명 생성

        return AmazonS3ClientBuilder.standard()
                .withRegion(region) // 리전 설정
                .withCredentials(new AWSStaticCredentialsProvider(credentials)) // 인증 정보 적용
                .build(); // 클라이언트 빌드
    }
}
