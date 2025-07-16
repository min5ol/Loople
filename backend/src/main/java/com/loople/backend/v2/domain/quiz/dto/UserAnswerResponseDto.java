package com.loople.backend.v2.domain.quiz.dto;

import lombok.Data;

@Data
public class UserAnswerResponseDto {
    private int isCorrect;
    private String message;
}
