/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 사용자 답안 제출을 위한 요청 DTO 클래스
*/
package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserAnswerRequestDto {
    private Long userId;    //답안을 제출한 사용자 ID
    private Long problemId; //답안이 제출된 문제 ID
    private String submittedAnswer; //사용자 제출 답안("A", "B", "X")
    private LocalDate solvedAt; //답안 제출 날짜
}
