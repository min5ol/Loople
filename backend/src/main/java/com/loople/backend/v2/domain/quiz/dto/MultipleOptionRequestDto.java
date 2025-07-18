/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 객관식 퀴즈 문항 중 각 보기 정보를 담는 DTO 클래스
 */
package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MultipleOptionRequestDto {
    private String content; //보기 내용("서울", "부산", ...)
    private int optionOrder;    //보기 순서(A=1, B=2, ...)
}
