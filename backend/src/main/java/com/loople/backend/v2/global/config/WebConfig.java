/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: CORS 설정을 위한 WebMvcConfigurer 설정 클래스
 *       - 프론트엔드 개발 서버와의 교차 출처 요청 허용
 */

package com.loople.backend.v2.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 스프링 설정 클래스
public class WebConfig {

    /**
     * CORS 설정을 위한 WebMvcConfigurer Bean 등록
     * - 개발 환경에서 프론트 서버(localhost:5173)와의 통신 허용
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // /api 경로 이하 요청에만 CORS 적용
                        .allowedOrigins("http://localhost:5173") // 허용할 프론트엔드 주소
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // 허용 HTTP 메서드
                        .allowedHeaders("*") // 모든 헤더 허용
                        .allowCredentials(true); // 쿠키/인증정보 포함 허용
            }
        };
    }
}