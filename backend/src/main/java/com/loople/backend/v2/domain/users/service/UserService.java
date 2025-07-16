/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: UserService의 인터페이스 정의, 회원가입 관련 비즈니스 로직 메서드 명세
 */

package com.loople.backend.v2.domain.users.service;

import com.loople.backend.v2.domain.users.dto.UserSignupRequest;
import com.loople.backend.v2.domain.users.dto.UserSignupResponse;

public interface UserService
{
    /**
     * 일반 회원가입 처리
     * @param request 회원가입 요청 DTO
     * @return 응답 DTO
     */
    UserSignupResponse signup(UserSignupRequest request);
}
