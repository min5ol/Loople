/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 퀴즈 문제 응답용 DTO 클래스
*/
package com.loople.backend.v2.domain.quiz.dto;

import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProblemResponseDto {
    private Long no;    //문제 고유 번호
    private String question;    //퀴즈 문제
    private ProblemType type;   //문제 유형
    private List<MultipleOptionResponseDto> options;    //객관식 보기 목록
    private boolean hasSolvedToday; //사용자의 문제 풀이 여부
}

