/**
 * 작성일자: 2025-07-17
 * 작성자: 장민솔
 * 설명: 일반 회원가입 요청 시 클라이언트로부터 전달받는 DTO (법정동 주소 기준)
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
        @NotBlank String detailAddress,
        @NotBlank String profileImageUrl,
        @NotBlank String sido,
        @NotBlank String sigungu,
        @NotBlank String eupmyun,
        String ri // nullable 허용 (읍면까지만 오는 경우도 있어서)
) {}
