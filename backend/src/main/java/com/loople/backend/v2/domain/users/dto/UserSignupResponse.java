/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 회원가입 완료 후 클라이언트에 응답으로 전달되는 DTO
 *       - 회원 식별자와 닉네임만 전달 (보안 및 최소 정보 원칙)
 */

package com.loople.backend.v2.domain.users.dto;

import com.loople.backend.v2.domain.users.entity.SignupStatus;

public record UserSignupResponse(

        Long userId,     // 생성된 사용자 ID
        String nickname,  // 사용자가 설정한 닉네임
        String token, // 가입 시 토큰 발급
        SignupStatus signupStatus
) {}