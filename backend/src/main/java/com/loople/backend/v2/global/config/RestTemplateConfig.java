/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 외부 API 통신을 위한 RestTemplate Bean 등록 설정 클래스
 *       - 공공데이터포털, 외부 인증서버 등과의 통신에 사용
 */

package com.loople.backend.v2.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration // 스프링 설정 클래스임을 명시
public class RestTemplateConfig {

    /**
     * RestTemplate Bean 등록
     * - @Autowired 또는 생성자 주입으로 어디서든 사용 가능
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}