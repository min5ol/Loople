/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 일반 회원가입 요청 시 클라이언트로부터 전달받는 DTO
 */

package com.loople.backend.v2.domain.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserSignupRequest(
        @Email @NotBlank String email,
        @NotBlank String password,
        @NotBlank String name,
        @NotBlank String nickname,
        @NotBlank String phone,
        @NotBlank String sido,
        @NotBlank String sigungu,
        @NotBlank String eupmyun,
        String ri,
        String detailAddress,
        String profileImageUrl
){}
