/**
 * 작성일: 2025.07.22
 * 작성자: 장민솔
 * 설명: provider 별 소셜 사용자 정보 조회 통합 서비스 인터페이스
 */

package com.loople.backend.v2.domain.auth.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;

public interface OAuthService
{
    /**
     * 소셜 provider + 코드로 사용자 정보 가져옴
     * @param provider "kakao", "google", "naver", "apple"
     * @param code 인가 코드 (authorization_code)
     * @return OAuthUserInfo 통합 사용자 정보
     */
    OAuthUserInfo getUserInfo(String provider, String code);
}
