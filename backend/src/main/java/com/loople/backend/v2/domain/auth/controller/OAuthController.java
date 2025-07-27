/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 소셜 로그인 엔드포인트 컨트롤러
 *      - provider 및 인가 코드를 받아 로그인 처리
 *      - 새로운 유저는 자동 회원가입
 *      - JWT 토큰 반환
 */

package com.loople.backend.v2.domain.auth.controller;

import com.loople.backend.v2.domain.auth.dto.OAuthLoginRequest;
import com.loople.backend.v2.domain.auth.dto.OAuthLoginResponse;
import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.domain.auth.service.OAuthService;
import com.loople.backend.v2.domain.users.entity.SignupStatus;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.domain.users.service.UserService;
import com.loople.backend.v2.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v2/oauth")
@RequiredArgsConstructor
public class OAuthController
{
    private final OAuthService oAuthService;
    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<OAuthLoginResponse> oauthLogin(@RequestBody OAuthLoginRequest request)
    {
        OAuthUserInfo userInfo = oAuthService.getUserInfo(request.provider(), request.code());

        Optional<User> existingUser = userRepository.findByProviderAndSocialId(userInfo.getProvider(), userInfo.getSocialId());

        if(existingUser.isPresent())
        {
            String token = jwtProvider.createToken(existingUser.get().getNo(), existingUser.get().getRole());
            return ResponseEntity.ok(new OAuthLoginResponse(token, false, userInfo.getEmail(), userInfo.getSocialId(), userInfo.getProvider()));
        }
        else
        {
            return ResponseEntity.ok(new OAuthLoginResponse(null, true, userInfo.getEmail(), userInfo.getSocialId(), userInfo.getProvider()));
        }
    }
}
