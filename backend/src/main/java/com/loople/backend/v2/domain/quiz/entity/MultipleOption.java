package com.loople.backend.v2.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name="quiz_multiple_option")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MultipleOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    // Problem과 다대일 관계 매핑 (외래키 컬럼명: problem_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    private String content;

    @Column(name="option_order")
    private int optionOrder;

    @Builder
    public MultipleOption(Problem problem, String content, int optionOrder) {
        this.problem = problem;
        this.content = content;
        this.optionOrder = optionOrder;
    }
}
