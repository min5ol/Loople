package com.loople.backend.v2.domain.auth.client;

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
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class NaverOAuthClient implements OAuthClient
{
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${oauth.naver.client-id}")
    private String clientId;

    @Value("${oauth.naver.client-secret}")
    private String clientSecret;

    @Value("${oauth.naver.redirect-uri}")
    private String redirectUri;

    private String getAccessToken(String code)
    {
        String tokenUri = "https://nid.naver.com/oauth2.0/token" +
                "?grant_type=authorization_code" +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + redirectUri +
                "&code=" + code;

        ResponseEntity<String> response = restTemplate.getForEntity(tokenUri, String.class);

        if(!response.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("네이버 사용자 정보 요청 실패");
        }

        try
        {
            JsonNode json = objectMapper.readTree(response.getBody());
            return json.get("accessToken").asText();
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("네이버 access token 파싱 실패", e);
        }
    }

    private OAuthUserInfo getUserInfoFromNaver(String accessToken)
    {
        String userInfoUri = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                userInfoUri, HttpMethod.GET, request, String.class
        );

        if(!response.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("네이버 사용자 정보 요청 실패");
        }

        try
        {
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            JsonNode userJson = responseJson.path("response");

            return new NaverUserInfo(
                    userJson.get("id").asText(),
                    userJson.get("email").asText()
            );
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("네이버 사용자 정보 파싱 실패", e);
        }
    }

    @Override
    public OAuthUserInfo getUserInfo(String code)
    {
        String accessToken = getAccessToken(code);
        return getUserInfoFromNaver(accessToken);
    }

    @Override
    public boolean supports(String provider)
    {
        return "naver".equalsIgnoreCase(provider);
    }
}
