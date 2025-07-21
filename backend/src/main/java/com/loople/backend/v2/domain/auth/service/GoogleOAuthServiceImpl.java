package com.loople.backend.v2.domain.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.auth.dto.GoogleUserInfo;
import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GoogleOAuthServiceImpl implements GoogleOAuthService
{
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${oauth.google.client-id}")
    private String clientId;

    @Value("${oauth.google.client-secret}")
    private String clientSecret;

    @Value("${oauth.google.redirect-uri}")
    private String redirectUri;

    @Override
    public OAuthUserInfo getUserInfo(String code) {
        // 1. 인가 코드로 액세스 토큰 요청
        String tokenUri = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "code=" + code +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + redirectUri +
                "&grant_type=authorization_code";

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(tokenUri, request, String.class);
        if(!tokenResponse.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("구글 액세스 토큰 요청 실패");
        }

        String accessToken;
        try
        {
            JsonNode jsonNode = objectMapper.readTree(tokenResponse.getBody());
            accessToken = jsonNode.get("access_toekn").asText();
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("액세스 토큰 파싱 실패", e);
        }

        // 2. 액세스 토큰으로 유저 정보 요청
        String userInfoUri = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);

        HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);

        ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                userInfoUri, HttpMethod.GET, userInfoRequest, String.class
        );

        if(!userInfoResponse.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("구글 사용자 정보 요청 실패");
        }

        try
        {
            JsonNode userJson = objectMapper.readTree(userInfoResponse.getBody());

            return new GoogleUserInfo(
                    userJson.get("id").asText(),
                    userJson.get("email").asText(),
                    userJson.get("name").asText(),
                    userJson.has("picture")?userJson.get("picture").asText() : null
            );
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("구글 사용자 정보 파싱 실패", e);
        }
    }
}
