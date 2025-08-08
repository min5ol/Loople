/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: Spring Security 기본 설정 구성 클래스
 *       - CSRF/CORS/폼 로그인/기본 인증 비활성화
 *       - 모든 요청 허용 (추후 보호 URL 지정 가능)
 *       - PasswordEncoder 빈 등록 (BCrypt)
 */

package com.loople.backend.v2.global.config;

import com.loople.backend.v2.global.jwt.JwtAuthenticationFilter;
import com.loople.backend.v2.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // 설정 클래스 등록
@EnableWebSecurity // Spring Security 활성화
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
     * - BCrypt 해시 함수 사용
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter()
    {
        return new JwtAuthenticationFilter(jwtProvider);
    }

    /**
     * SecurityFilterChain 설정
     * - 기본 보안 기능 비활성화
     * - 모든 요청을 인증 없이 허용 (개발 단계용)
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception
    {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .formLogin(f -> f.disable())
                .httpBasic(b -> b.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401); res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Unauthorized\"}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403); res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Forbidden\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/health",
                                "/error",
                                "/api/v2/**",
                                "/v3/api-docs/**", "/swagger-ui/**"
                        ).permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}