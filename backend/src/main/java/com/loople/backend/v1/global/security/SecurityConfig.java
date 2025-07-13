/**
 * Spring Security 설정
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
