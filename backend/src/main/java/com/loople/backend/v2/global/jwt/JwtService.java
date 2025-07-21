/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 토큰 발급 관련 서비스 인터페이스
 */

package com.loople.backend.v2.global.jwt;

import com.loople.backend.v2.domain.users.entity.User;

public interface JwtService
{
    // User 객체 기반 토큰 발급
    String issueToken(User user);

    // 토큰 검증
    boolean validate(String token);

    // 사용자 ID 추출
    Long extractUserId(String token);

    // 권한(Role) 추출
    String extractRole(String token);
}
