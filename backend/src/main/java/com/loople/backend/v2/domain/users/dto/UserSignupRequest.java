/**
 * 작성일자: 2025-07-17
 * 작성자: 장민솔
 * 설명: 일반 회원가입 시 클라이언트로부터 전달받는 DTO
 *       - 주소는 법정동 기준으로 구분 (시도, 시군구, 읍면동, 리)
 *       - 필수 항목은 validation 어노테이션으로 검사
 */

package com.loople.backend.v2.domain.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserSignupRequest(

        @Email @NotBlank String email,            // 이메일 (형식 및 공백 체크)
        @NotBlank String password,                // 비밀번호
        @NotBlank String name,                    // 실명
        @NotBlank String nickname,                // 닉네임
        @NotBlank String phone,                   // 휴대폰 번호
        @NotBlank String detailAddress,           // 상세 주소 (건물명, 호수 등)
        @NotBlank String profileImageUrl,         // 프로필 이미지 S3 URL
        @NotBlank String sido,                    // 시/도 (예: 경상남도)
        @NotBlank String sigungu,                 // 시/군/구 (예: 창원시 마산회원구)
        @NotBlank String eupmyun,                 // 읍/면/동 (예: 내서읍)
        String ri                                  // 리 (nullable 허용, 예: 삼계리)
) {}