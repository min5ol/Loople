/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 외부 API 통신을 위한 RestTemplate Bean 등록 설정 클래스
 */

package com.loople.backend.v2.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig
{
    @Bean
    public RestTemplate restTemplate()
    {
        return new RestTemplate();
    }
}
