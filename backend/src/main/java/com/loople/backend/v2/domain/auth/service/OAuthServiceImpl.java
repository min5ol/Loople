package com.loople.backend.v2.domain.auth.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthServiceImpl implements OAuthService
{
    private final KakaoOAuthService kakaoOAuthService;
    private final GoogleOAuthService googleOAuthService;
    private final NaverOAuthService naverOAuthService;

    @Override
    public OAuthUserInfo getUserInfo(String provider, String code) {
        return switch(provider.toLowerCase())
        {
            case "kakao" -> kakaoOAuthService.getUserInfo(code);
            case "google" -> googleOAuthService.getUserInfo(code);
            case "naver" -> naverOAuthService.getUserInfo(code);
            default -> throw new IllegalArgumentException("지원하지 않는 provder: " + provider);
        };
    }
}
