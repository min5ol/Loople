package com.loople.backend.v2.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="quiz_user_answer")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    @Column(name="submitted_at")
    private LocalDateTime submittedAt;

    @Builder
    public UserAnswer(Long userId, Long problemId, String submittedAnswer, int isCorrect) {
        this.userId = userId;
        this.problemId = problemId;
        this.submittedAnswer = submittedAnswer;
        this.isCorrect = isCorrect;
    }
}
