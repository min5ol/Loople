/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 퀴즈 문제를 나타내는 엔티티 클래스
*/
package com.loople.backend.v2.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="quiz_problem")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;    //문제 고유 식별자

    @Column(columnDefinition = "TEXT")  //문제의 질문 내용, 길이 제한 없이 저장
    private String question;

    @Enumerated(EnumType.STRING)
    private ProblemType type;   //문제 유형(OX/MULTIPLE)

    @Column(name="answer")
    private String answer;  //문제 정답 정보

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;    //생성 시간: DB에서 자동으로 설정됨

    @Builder
    public Problem(String question, ProblemType type, String answer) {
        this.question = question;
        this.type = type;
        this.answer = answer;
    }
}
