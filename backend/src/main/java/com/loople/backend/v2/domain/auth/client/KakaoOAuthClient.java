package com.loople.backend.v2.domain.auth.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.auth.dto.KakaoUserInfo;
import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class KakaoOAuthClient implements OAuthClient
{
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.client-secret}")
    private String clientSecret;

    @Value("${oauth.kakao.redirect-uri}")
    private String redirectUri;

    private String getAccessToken(String code)
    {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=authorization_code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&code=" + code +
                "&client_secret=" + clientSecret;

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                tokenUrl, HttpMethod.POST, request, String.class
        );

        if(!response.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("카카오 액세스 토큰 요청 실패");
        }

        try
        {
            JsonNode json = objectMapper.readTree(response.getBody());
            return json.get("access_token").asText();
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("카카오 access token 파싱 실패", e);
        }
    }

    private OAuthUserInfo getUserInfoFromKakao(String accessToken)
    {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                userInfoUrl, HttpMethod.GET, request, String.class
        );

        if(!response.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("카카오 사용자 정보 요청 실패");
        }

        try
        {
            JsonNode json = objectMapper.readTree(response.getBody());

            String socialId = json.get("id").asText();
            String email = json.path("kakao_account").path("email").asText("");

            return new KakaoUserInfo(socialId, email);
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("카카오 사용자 정보 파싱 실패", e);
        }
    }

    @Override
    public OAuthUserInfo getUserInfo(String code) {
        String accessToken = getAccessToken(code);

        return getUserInfoFromKakao(accessToken);
    }

    @Override
    public boolean supports(String provider) {
        return "kakao".equalsIgnoreCase(provider);
    }
}
