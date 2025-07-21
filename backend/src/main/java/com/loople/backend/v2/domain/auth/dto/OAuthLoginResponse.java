/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 소셜 로그인 성공 시 JWT 응답 DTO
 */

package com.loople.backend.v2.domain.auth.dto;

public record OAuthLoginResponse(
        String accessToken, // JWT 토큰
        boolean isNewUser
) {}
