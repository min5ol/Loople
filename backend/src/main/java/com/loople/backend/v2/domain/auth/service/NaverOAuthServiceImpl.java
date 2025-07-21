/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 네이버 OAuth 로그인 처리 서비스
 */

package com.loople.backend.v2.domain.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.auth.dto.NaverUserInfo;
import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class NaverOAuthServiceImpl implements NaverOAuthService
{
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${oauth.naver.client-id}")
    private String clientId;

    @Value("${oauth.naver.client-secret}")
    private String clientSecret;

    @Value("${oauth.naver.redirect-uri}")
    private String redirectUri;

    @Override
    public OAuthUserInfo getUserInfo(String code)
    {
        // 1. 인가코드로 토큰 요청
        String tokenUri = "https://nid.naver.com/oauth2.0/token"
                + "?grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&redirect_uri=" + redirectUri
                + "&code=" + code;

        ResponseEntity<String> tokenResponse = restTemplate.getForEntity(tokenUri, String.class);
        if(!tokenResponse.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("네이버 액세스 토큰 요청 실패");
        }

        String accessToken;
        try
        {
            JsonNode jsonNode = objectMapper.readTree(tokenResponse.getBody());
            accessToken = jsonNode.get("access_token").asText();
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("토큰 파싱 실패", e);
        }

        // 2. 액세스 토큰으로 사용자 정보 요청
        String userInfoUri = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> userInfoRequest = new HttpEntity<>(headers);

        ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                userInfoUri, HttpMethod.GET, userInfoRequest, String.class
        );

        if(!userInfoResponse.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("네이버 사용자 정보 요청 실패");
        }

        try
        {
            JsonNode responseNode = objectMapper.readTree(userInfoResponse.getBody());
            return new NaverUserInfo(
                    responseNode.get("id").asText(),
                    responseNode.get("email").asText(),
                    responseNode.get("nickname").asText(),
                    responseNode.has("profile_image") ? responseNode.get("profile_image").asText() : null
            );
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("네이버 사용자 정보 파싱 실패", e);
        }
    }
}
