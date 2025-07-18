/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 객관식 퀴즈 응답 시, 각 보기 정보를 클라이언트에게 전달하기 위한 DTO 클래스
 */
package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MultipleOptionResponseDto {
    private String content;
    private int optionOrder;
}
