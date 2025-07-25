package com.loople.backend.v2.domain.auth.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.auth.dto.GoogleUserInfo;
import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class GoogleOAuthClient implements OAuthClient
{
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${oauth.google.client-id}")
    private String clientId;

    @Value("${oauth.google.client-secret}")
    private String clientSecret;

    @Value("${oauth.google.redirect-uri}")
    private String redirectUri;

    private String getAccessToken(String code)
    {
        String tokenUri = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "code=" + code +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + redirectUri +
                "&grant_type=authorization_code";

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(tokenUri, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new UnauthorizedException("구글 액세스 토큰 요청 실패");
        }

        try {
            JsonNode json = objectMapper.readTree(response.getBody());
            return json.get("access_token").asText();
        } catch (Exception e) {
            throw new UnauthorizedException("구글 access token 파싱 실패", e);
        }
    }

    private OAuthUserInfo getUserInfoFromGoogle(String accessToken)
    {
        String userInfoUri = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                userInfoUri, HttpMethod.GET, request, String.class
        );

        if(!response.getStatusCode().is2xxSuccessful())
        {
            throw new UnauthorizedException("구글 사용자 정보 요청 실패");
        }

        try
        {
            JsonNode userJson = objectMapper.readTree(response.getBody());

            return new GoogleUserInfo(
                    userJson.get("id").asText(),
                    userJson.get("email").asText()
            );
        }
        catch (Exception e)
        {
            throw new UnauthorizedException("구글 사용자 정보 파싱 실패", e);
        }
    }

    @Override
    public OAuthUserInfo getUserInfo(String code)
    {
      String accessToken = getAccessToken(code);

      return getUserInfoFromGoogle(accessToken);
    }

    @Override
    public boolean supports(String provider)
    {
        return "google".equalsIgnoreCase(provider);
    }
}
