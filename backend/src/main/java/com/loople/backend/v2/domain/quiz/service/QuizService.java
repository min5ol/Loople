/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 퀴즈 도메인의 서비스 인터페이스
        퀴즈 문제 생성, 옵션 저장, 사용자 답안 저자아 및 오늘 문제 풀이 여부 기능 정의
*/
package com.loople.backend.v2.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.loople.backend.v2.domain.quiz.dto.*;
import com.loople.backend.v2.domain.quiz.entity.Problem;

import java.util.List;

public interface QuizService {
    /**
        OpenAPI에서 받은 문제의 응답 문자열을 저장하고, 저장된 문제 정보 DTO 반환
        @param response: OpenAPI에서 받은 문제 생성 결과 문자열
        @return 저장된 문제 정보를 담은 ProblemResponseDto
     */
    void saveProblem(String response);


    /**
     * 사용자가 제출한 답안을 저장하고 정답 여부, 점수 등의 결과 반환
     * @param userAnswerRequestDto: 사용자 답안 요청 DTO
     * @param userId: 사용자 ID
     * @return 답안 채점 결과를 담은 UserAnswerResponseDto
     */
    UserAnswerResponseDto saveUserAnswer(UserAnswerRequestDto userAnswerRequestDto, Long userId);

    List<Integer> fetchAttendanceStatus(Long userId);

    ProblemResponseDto getProblem(Long userId);

    AttendanceInfoResponse getAttendanceInfo(Long userId);
}
