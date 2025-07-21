/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: provider 별 유저 정보를 받아오는 서비스 인터페이스
 */

package com.loople.backend.v2.domain.auth.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;

public interface OAuthService
{
    OAuthUserInfo getUserInfo(String provider, String code);
}
