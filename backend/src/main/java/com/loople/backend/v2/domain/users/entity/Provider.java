/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 회원가입 및 로그인 시 사용되는 인증 제공자(enum)
 *       - LOCAL: 자체 회원가입
 *       - KAKAO, GOOGLE, NAVER, APPLE: 소셜 로그인
 */

package com.loople.backend.v2.domain.users.entity;

public enum Provider {

    LOCAL,   // 자체 이메일/비밀번호 방식 회원가입
    KAKAO,   // 카카오 소셜 로그인
    GOOGLE,  // 구글 소셜 로그인
    NAVER,   // 네이버 소셜 로그인
    APPLE    // 애플 소셜 로그인
}
