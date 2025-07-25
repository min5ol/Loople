package com.loople.backend.v2.domain.auth.client;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;

public interface OAuthClient
{
    OAuthUserInfo getUserInfo(String code);
    boolean supports(String provider);
}
