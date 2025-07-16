package com.loople.backend.v2.domain.quiz.service;

import com.loople.backend.v2.domain.quiz.dto.MultipleOptionRequestDto;
import com.loople.backend.v2.domain.quiz.dto.ProblemResponseDto;
import com.loople.backend.v2.domain.quiz.entity.Problem;

import java.util.List;

public interface QuizService {
    ProblemResponseDto saveProblem(String response);
    void saveOption(List<MultipleOptionRequestDto> options, Problem problem);
}
