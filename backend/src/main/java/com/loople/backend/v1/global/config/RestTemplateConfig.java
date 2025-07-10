/**
 * RestTemplate 설정
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * RestTemplate Bean 등록
 */
@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate Bean 생성
     * @return RestTemplate
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(); // RestTemplate 인스턴스 반환
    }
}
