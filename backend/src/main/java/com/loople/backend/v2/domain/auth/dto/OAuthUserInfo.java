/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: provider 별 사용자 정보를 통일된 형태로 제공하는 인터페이스
 */

package com.loople.backend.v2.domain.auth.dto;

import com.loople.backend.v2.domain.users.entity.Provider;

public interface OAuthUserInfo
{
    String getSocialId();
    String getEmail();
    String getNickname();
    String getProfileImageUrl();
    Provider getProvider();
}
