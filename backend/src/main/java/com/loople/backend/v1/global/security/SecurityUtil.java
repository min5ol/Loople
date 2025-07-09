/**
 * 보안 유틸리티
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.global.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 인증된 사용자 정보 처리
 */
public class SecurityUtil {

    /**
     * 현재 로그인한 사용자 ID 반환
     * @return 사용자 ID(Long)
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // 인증 정보 가져오기

        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("No authenticated user found"); // 인증 사용자 없으면 예외 발생
        }

        return Long.parseLong(authentication.getName()); // 사용자 ID 반환
    }
}
