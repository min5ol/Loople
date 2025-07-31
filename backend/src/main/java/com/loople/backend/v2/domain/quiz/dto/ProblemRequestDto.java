/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 퀴즈 문제 생성을 위한 요청 DTO 클래스
 */
package com.loople.backend.v2.domain.quiz.dto;

import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemRequestDto {
    private String question;    //퀴즈 문제
    private ProblemType type;   //퀴즈 유형(OX/MULTIPLE)
    private String answer;  //정답 (OX: "O"/"X", MULTIPLE: "A"/"B"/"C"/"D")

    private List<MultipleOptionRequestDto> options; //객관식 보기 목록(OX 문제는 null 또는 빈 리스트)
}
