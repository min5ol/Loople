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
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.service.UserService;
import com.loople.backend.v2.global.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class OAuthController
{
    private final OAuthService oAuthService;
    private final UserService userService;
    private final JwtService jwtService;

    /**
     * 프론트에서 소셜 로그인 시도 시 호출되는 엔드포인트
     * @param request provider, code 포함
     * @return JWT access token
     */

    @PostMapping("/login")
    public ResponseEntity<OAuthLoginResponse> login(@RequestBody OAuthLoginRequest request)
    {
        // 1. provider + code로 사용자 정보 받아오기
        OAuthUserInfo userInfo = oAuthService.getUserInfo(request.provider(), request.code());

        // 2. 기존 유저 조회 또는 자동 회원가입
        User user = userService.findOrRegister(userInfo);

        // 3. JWT 토큰 발급
        String jwt = jwtService.issueToken(user);

        // 4. 신규 유저 여부 확인
        boolean isNewUser = userService.isNewUser(user);

        return ResponseEntity.ok(new OAuthLoginResponse(jwt, isNewUser));
    }
}
