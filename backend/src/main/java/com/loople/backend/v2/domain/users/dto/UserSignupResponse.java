/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 회원가입 완료 후 사용자 정보 일부를 응답으로 전달하는 DTO
 */

package com.loople.backend.v2.domain.users.dto;

public record UserSignupResponse(
        Long userId,
        String nickname
) {}
