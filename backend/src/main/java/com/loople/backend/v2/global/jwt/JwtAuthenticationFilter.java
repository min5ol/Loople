/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: JWT 인증 필터
 *        - HTTP 요청에서 Authorization 헤더로부터 JWT 추출
 *        - 토큰 유효성 검증 및 사용자 인증 객체 생성
 */

package com.loople.backend.v2.global.jwt;

import org.springframework.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    // Authorization 헤더에서 Bearer 토큰을 추출
    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7); // "Bearer " 이후의 문자열이 실제 토큰
        }
        return null;
    }

    // 실제 필터 동작 정의
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 요청에서 토큰 추출
        String token = resolveToken(request);

        // 토큰 유효성 검사
        if (token != null && jwtProvider.validateToken(token)) {
            Long userNo = jwtProvider.getUserId(token); // 사용자 식별자 추출
            String role = jwtProvider.getRole(token);   // 사용자 권한 추출 (현재 미사용)

            // Spring Security 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userNo, null, null);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // SecurityContext에 인증 객체 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}