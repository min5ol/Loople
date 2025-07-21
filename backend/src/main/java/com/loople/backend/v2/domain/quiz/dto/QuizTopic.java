/*
    작성일: 2025-07-21
 */
package com.loople.backend.v2.domain.quiz.dto;

import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizTopic {
    private String topic;
    private ProblemType problemType;
}
