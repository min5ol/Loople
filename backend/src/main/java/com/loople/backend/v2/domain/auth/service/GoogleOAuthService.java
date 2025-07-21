/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: provider "google" 유저 코드 획득 서비스 인터페이스
 */

package com.loople.backend.v2.domain.auth.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;

public interface GoogleOAuthService
{
    OAuthUserInfo getUserInfo(String code);
}
