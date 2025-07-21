/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 서비스 인터페이스
 *       - 회원가입 및 로그인과 관련된 핵심 비즈니스 로직 명세 정의
 */

package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.auth.dto.OAuthUserInfo;
import com.loople.backend.v2.domain.users.dto.UserLoginRequest;
import com.loople.backend.v2.domain.users.dto.UserLoginResponse;
import com.loople.backend.v2.domain.users.dto.UserSignupRequest;
import com.loople.backend.v2.domain.users.dto.UserSignupResponse;
import com.loople.backend.v2.domain.users.entity.User;

public interface UserService {

    /**
     * 일반 회원가입 처리
     *
     * @param request 회원가입 요청 DTO (이메일, 비밀번호, 이름, 주소 등 포함)
     * @return 생성된 사용자 정보 (userId, nickname 등)
     */
    UserSignupResponse signup(UserSignupRequest request);

    /**
     * 로그인 요청 처리
     *
     * @param request 로그인 요청 DTO (이메일, 비밀번호)
     * @return 로그인 성공 시 토큰 포함 응답 DTO
     */
    UserLoginResponse login(UserLoginRequest request);

    boolean isEmailAvailable(String email);

    boolean isNicknameAvailable(String nickname);

    User findOrRegister(OAuthUserInfo userInfo);

    boolean isNewUser(User user);
}