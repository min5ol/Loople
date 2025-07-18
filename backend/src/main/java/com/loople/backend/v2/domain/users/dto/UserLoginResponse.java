/**
 * 작성일자: 2025-07-17
 * 작성자: 장민솔
 * 설명: 로그인 성공 시 클라이언트에 반환되는 응답 DTO
 *       - 인증 토큰을 포함
 */

package com.loople.backend.v2.domain.users.dto;

public record UserLoginResponse(
        String token // 로그인 후 클라이언트에 전달할 JWT 또는 액세스 토큰
) {}
