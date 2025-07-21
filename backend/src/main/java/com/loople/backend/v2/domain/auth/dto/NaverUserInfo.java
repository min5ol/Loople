package com.loople.backend.v2.domain.auth.dto;

import com.loople.backend.v2.domain.users.entity.Provider;

public record NaverUserInfo(
        String socialId,
        String email,
        String nickname,
        String profileImageUrl
) implements OAuthUserInfo
{
    @Override
    public String getSocialId() {
        return socialId;
    }

    @Override
    public String getEmail() {
        return email;
    }

    @Override
    public String getNickname() {
        return nickname;
    }

    @Override
    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    @Override
    public Provider getProvider() {
        return Provider.NAVER;
    }
}
