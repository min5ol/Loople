package com.loople.backend.v2.domain.auth.service;

import com.loople.backend.v2.domain.auth.client.OAuthClient;
import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OAuthServiceImpl implements OAuthService
{
    private final List<OAuthClient> oAuthClients;

    @Override
    public OAuthUserInfo getUserInfo(String provider, String code)
    {
        return oAuthClients.stream()
                .filter(client -> client.supports(provider))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 provider"))
                .getUserInfo(code);
    }
}
