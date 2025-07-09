/**
 * Spring Security 설정
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 보안 필터 체인 설정
 */
@Configuration
public class SecurityConfig {

    /**
     * HTTP 보안 설정
     * @param http - HttpSecurity 객체
     * @return SecurityFilterChain
     * @throws Exception - 설정 오류 발생 시
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // CSRF 비활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/swagger-ui.html",
                                "/webjars/**",
                                "/api/v1/auth/**" // 로그인, 회원가입 등 허용
                        ).permitAll() // 위 경로는 인증 없이 허용
                        .anyRequest().authenticated() // 나머지는 인증 필요
                );

        return http.build(); // 필터 체인 빌드
    }
}
