/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 사용자 답안 제출 결과를 반환하기 위한 응답 DTO 클래스
*/
package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAnswerResponseDto {
    private int isCorrect;  //사용자의 정답 여부(1: true, 0: false)
    private int isWeekly;   //주간 접속 여부
    private int isMonthly;  //월간 접속 여부
    private int points; //사용자 획득 포인트
}
