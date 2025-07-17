/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 관련 API 엔드포인트. 회원가입 요청을 처리한다
 */

package com.loople.backend.v2.domain.users.controller;

import com.loople.backend.v2.domain.users.dto.UserLoginRequest;
import com.loople.backend.v2.domain.users.dto.UserLoginResponse;
import com.loople.backend.v2.domain.users.dto.UserSignupRequest;
import com.loople.backend.v2.domain.users.dto.UserSignupResponse;
import com.loople.backend.v2.domain.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/users")
@RequiredArgsConstructor
public class UserController
{
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponse> signup(@RequestBody @Valid UserSignupRequest request)
    {
        UserSignupResponse response = userService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request)
    {
        return ResponseEntity.ok(userService.login(request));
    }
}
