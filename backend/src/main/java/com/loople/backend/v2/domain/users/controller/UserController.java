/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 관련 API 엔드포인트
 *       - 회원가입 및 소셜 회원가입 요청 처리
 *       - 로그인 요청 처리 및 토큰 응답
 */

package com.loople.backend.v2.domain.users.controller;

import com.loople.backend.v2.domain.users.dto.*;
import com.loople.backend.v2.domain.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/users")
@RequiredArgsConstructor
@Slf4j
public class UserController
{
    private final UserService userService;

    @GetMapping("/check-email")
    public ResponseEntity<EmailCheckResponse> checkEmail(@RequestParam String email)
    {
        boolean isAvailable = userService.checkEmail(email).available();
        return ResponseEntity.ok(new EmailCheckResponse(isAvailable));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<NicknameCheckResponse> checkNickname(@RequestParam String nickname)
    {
        boolean isAvailable = userService.checkNickname(nickname).available();
        return ResponseEntity.ok(new NicknameCheckResponse(isAvailable));
    }

    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponse> signup(@RequestBody @Valid UserSignupRequest request)
    {
        log.info("[로컬 회원가입 요청] email={}, nickname={}", request.email(), request.nickname());

        UserSignupResponse response = userService.signup(request);
        log.info("[로컬 회원가입 완료] userId={}, nickname={}, status={}", response.userId(), response.nickname(), response.signupStatus());

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/social-signup")
    public ResponseEntity<SocialSignupResponse> socialSignup(@RequestBody @Valid SocialSignupRequest request)
    {
        log.info("[소셜 회원가입 요청] email={}, provider={}, nickname={}", request.email(), request.provider(), request.nickname());

        SocialSignupResponse response = userService.socialSignup(request);
        log.info("[소셜 회원가입 완료] userId={}, nickname={}, status={}", response.userId(), response.nickname(), response.signupStatus());

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody @Valid UserLoginRequest request)
    {
        log.info("[로컬 로그인 요청] email={}", request.email());

        UserLoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/points")
    public ResponseEntity<Void> updatePoints(@RequestBody @Valid UpdatedUserPointRequest request)
    {
        log.info("[포인트 적립 요청] points={}", request.getPoints());

        userService.updatePoints(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{userId}/complete")
    public ResponseEntity<Void> completeSignup(@PathVariable Long userId)
    {
        userService.completeSignup(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/avatar/default")
    public ResponseEntity<Void> assignDefaultAvatar(@PathVariable Long userId)
    {
        userService.assignDefaultAvatar(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/badge/default")
    public ResponseEntity<Void> assignDefaultBadge(@PathVariable Long userId)
    {
        userService.assignDefaultBadge(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/room/default")
    public ResponseEntity<Void> assignDefaultRoom(@PathVariable Long userId)
    {
        userService.assignDefaultRoom(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/loopling")
    public ResponseEntity<Void> assignLoopling(@PathVariable Long userId, @RequestParam Long catalogId)
    {
        userService.assignLoopling(userId, catalogId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/village")
    public ResponseEntity<Void> assignVillage(@PathVariable Long userId)
    {
        userService.assignVillage(userId);
        return ResponseEntity.ok().build();
    }
}