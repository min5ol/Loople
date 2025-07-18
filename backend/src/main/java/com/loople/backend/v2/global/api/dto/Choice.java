/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: OpenAPI 응답에서 각 선택지를 담는 DTO 클래스
*/
package com.loople.backend.v2.global.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)    //final 필드 강제 초기화
public class Choice {
    private final Message message;  //응답 메시지 객체
}
