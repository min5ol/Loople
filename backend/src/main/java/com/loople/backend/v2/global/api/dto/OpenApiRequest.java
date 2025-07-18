/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: OpenAPI 요청에 필요한 데이터를 담는 DTO 클래스
*/
package com.loople.backend.v2.global.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor(force=true)
@Getter
public class OpenApiRequest {
    public final String model;  //사용할 AI 모델 이름(gpt-4o)
    public final Message[] messages;    //대화 내역 메시지 배열
    public final double temperature;    //생성 결과의 다양성 정도 조절 파라미터
}
