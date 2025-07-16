package com.loople.backend.v2.domain.quiz.dto;

import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProblemResponseDto {
    private String question;
    private ProblemType type;
    private List<MultipleOptionResponseDto> options;
}

