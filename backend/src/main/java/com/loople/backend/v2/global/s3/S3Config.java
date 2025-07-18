/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: AWS S3 클라이언트를 빈으로 등록하는 설정 클래스 (v1 SDK 기준)
 */

package com.loople.backend.v2.global.s3;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    // application.yml 또는 properties에서 가져오는 값들
    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    /**
     * AmazonS3 빈 등록
     * @return AmazonS3 클라이언트
     */
    @Bean
    public AmazonS3 amazonS3() {
        // 기본 자격 증명 생성
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);

        // S3 클라이언트 생성 및 빈으로 등록
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }
}