package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAnswerResponseDto {
    private int isCorrect;
    private int isWeekly;
    private int isMonthly;
    private int points;
}
