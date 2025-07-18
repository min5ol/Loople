/**
 * 작성일자: 2025-07-17
 * 작성자: 장민솔
 * 설명: 로그인 요청 시 클라이언트로부터 전달받는 데이터 구조
 *       - 이메일과 비밀번호를 포함
 */

package com.loople.backend.v2.domain.users.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserLoginRequest(

        @JsonProperty("email") String email,       // 로그인에 사용할 이메일
        @JsonProperty("password") String password  // 비밀번호 (로그에 출력하지 않음!)
) {}
