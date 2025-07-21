/**
 * 작성일: 2025.07.21
 * 작성자: 장민솔
 * 설명: 프론트에서 소셜 로그인 요청 시 전달받는 DTO
 */

package com.loople.backend.v2.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OAuthLoginRequest(
        @JsonProperty("provider") String provider, // "kakao", "google", "naver", "apple"
        @JsonProperty("code") String code // 인가 코드
) {}
