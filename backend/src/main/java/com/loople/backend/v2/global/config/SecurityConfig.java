/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: Spring Security 기본 설정 구성 클래스
 *       - CSRF/CORS/폼 로그인/기본 인증 비활성화
 *       - 모든 요청 허용 (추후 보호 URL 지정 가능)
 *       - PasswordEncoder 빈 등록 (BCrypt)
 */

package com.loople.backend.v2.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration // 설정 클래스 등록
@EnableWebSecurity // Spring Security 활성화
public class SecurityConfig {

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
     * - BCrypt 해시 함수 사용
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * SecurityFilterChain 설정
     * - 기본 보안 기능 비활성화
     * - 모든 요청을 인증 없이 허용 (개발 단계용)
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())             // CSRF 비활성화 (API 서버에선 보통 비활성)
                .cors(cors -> {})                         // CORS 기본 설정 적용 (필요시 WebMvcConfig 별도 설정)
                .formLogin(form -> form.disable())        // 폼 로그인 사용 안 함
                .httpBasic(basic -> basic.disable())      // HTTP Basic 인증 비활성화
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()         // 모든 요청 허용 (추후 인증 URL 적용 가능)
                );

        return http.build();
    }
}