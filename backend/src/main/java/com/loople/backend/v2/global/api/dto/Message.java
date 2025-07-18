/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: OpenAPI 응답 메시지 역할과 내용을 담는 DTO 클래스
*/
package com.loople.backend.v2.global.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
public class Message {
    public final String role;
    public final String content;
}
