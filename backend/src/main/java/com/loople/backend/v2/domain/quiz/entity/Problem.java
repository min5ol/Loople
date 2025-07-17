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
    private Long no;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Enumerated(EnumType.STRING)
    private ProblemType type;

    @Column(name="answer")
    private String answer;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Builder
    public Problem(String question, ProblemType type, String answer) {
        this.question = question;
        this.type = type;
        this.answer = answer;
    }
}
