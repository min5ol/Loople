package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserAnswerRequestDto {
    private Long userId;
    private Long problemId;
    private String submittedAnswer;
    private LocalDate solvedAt;
}
