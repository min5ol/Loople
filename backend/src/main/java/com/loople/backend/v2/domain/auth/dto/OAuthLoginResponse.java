/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 소셜 로그인 성공 시 JWT 응답 DTO
 */

package com.loople.backend.v2.domain.auth.dto;

import com.loople.backend.v2.domain.users.entity.Provider;

public record OAuthLoginResponse(
        String token,
        boolean isNew,
        String email,
        String socialId,
        Provider provider
) {}
