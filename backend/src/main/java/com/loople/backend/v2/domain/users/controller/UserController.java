/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 관련 API 엔드포인트
 *       - 회원가입 요청 처리
 *       - 로그인 요청 처리 및 토큰 응답
 */

package com.loople.backend.v2.domain.users.controller;

import com.loople.backend.v2.domain.users.dto.UserLoginRequest;
import com.loople.backend.v2.domain.users.dto.UserLoginResponse;
import com.loople.backend.v2.domain.users.dto.UserSignupRequest;
import com.loople.backend.v2.domain.users.dto.UserSignupResponse;
import com.loople.backend.v2.domain.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j // 로그 기록을 위한 Lombok 어노테이션
@RestController
@RequestMapping("/api/v2/users") // 사용자 관련 엔드포인트
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 회원가입 요청 처리
     * @param request 회원가입 요청 데이터
     * @return 가입된 유저 응답 정보
     */
    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponse> signup(@RequestBody @Valid UserSignupRequest request) {
        log.info("회원가입 요청: 이메일={}, 닉네임={}, 주소=({}, {}, {}, {})",
                request.email(), request.nickname(),
                request.sido(), request.sigungu(), request.eupmyun(), request.ri());

        UserSignupResponse response = userService.signup(request);

        log.info("회원가입 완료: userId={}, nickname={}", response.userId(), response.nickname());

        return ResponseEntity.ok(response);
    }

    /**
     * 로그인 요청 처리
     * @param request 로그인 요청 데이터
     * @return 로그인 성공 시 토큰 응답
     */
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request) {
        log.info("로그인 요청: email={}", request.email());

        UserLoginResponse response = userService.login(request);

        log.info("로그인 성공: token={}", response.token());

        return ResponseEntity.ok(response);
    }
}
