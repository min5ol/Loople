package com.loople.backend.v2.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="quiz_user_answer")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="user_id")
    private Long userId;

    @Column(name="problem_id")
    private Long problemId;

    @Column(name="submitted_answer")
    private String submittedAnswer;

    @Column(name="is_correct")
    private int isCorrect;

    //참가(오답) 1, 정답 3, 주간 20, 월간 100
    private int points;

    @Column(name="solved_at", insertable = false, updatable=false)
    private LocalDate solvedAt;

    @Builder
    public UserAnswer(Long userId, Long problemId, String submittedAnswer, int isCorrect, int points) {
        this.userId = userId;
        this.problemId = problemId;
        this.submittedAnswer = submittedAnswer;
        this.isCorrect = isCorrect;
        this.points = points;
    }
}
