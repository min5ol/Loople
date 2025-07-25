/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 서비스 인터페이스
 *       - 회원가입 및 로그인과 관련된 핵심 비즈니스 로직 명세 정의
 */

package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.domain.users.dto.*;

public interface UserService
{
    // 일반 회원가입
    UserSignupResponse signup(UserSignupRequest request);

    // 소셜 회원가입
    SocialSignupResponse socialSignup(SocialSignupRequest request);

    // 로그인
    UserLoginResponse login(UserLoginRequest request);

    // 중복 확인
    EmailCheckResponse checkEmail(String email);
    NicknameCheckResponse checkNickname(String nickname);

    // 소셜 로그인 시 기존 유저 or 신규 유저 구분 후 redirect 여부 판단
    UserLoginResponse socialLoginOrRedirect(OAuthUserInfo userInfo);

    void updatePoints(UpdatedUserPointRequest request);
}
