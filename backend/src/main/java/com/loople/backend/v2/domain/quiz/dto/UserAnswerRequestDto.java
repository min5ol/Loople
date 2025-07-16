package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAnswerRequestDto {
    private Long userId;
    private Long problemId;
    private String submittedAnswer;
}
