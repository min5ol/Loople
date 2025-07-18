/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: OpenAPI 응답 데이터에서 선택된 결과 배열을 담는 DTO 클래스
*/
package com.loople.backend.v2.global.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(force = true)
public class OpenApiResponse {
    private final Choice[] choices; //OpenAPI에서 반환된 여러 답변들
}
