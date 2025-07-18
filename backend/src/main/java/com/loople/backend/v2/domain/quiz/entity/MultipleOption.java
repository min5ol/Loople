/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 다중 선택형 퀴즈 문제의 각 옵션을 나타내는 엔티티 클래스
         각 선택지는 문제(Problem)와 n:1 관계로 연결되어 있음
*/
package com.loople.backend.v2.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name="quiz_multiple_option") //DB 테이블명 지정
@NoArgsConstructor(access = AccessLevel.PROTECTED)  //기본 생성자를 protected로 제한
public class MultipleOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto_increment
    private Long no;    //옵션 고유 번호(PK)

    // Problem과 다대일 관계 매핑, 지연 로딩(fetch = LAZY)
    // 외래키 컬럼명: problem_id (null 불가)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    private String content; //객관식 보기 내용

    @Column(name="option_order")    //DB 컬럼명 지정
    private int optionOrder;    //보기 순서(A=1, B=2, ...)

    @Builder    //빌더 패턴 생성자
    public MultipleOption(Problem problem, String content, int optionOrder) {
        this.problem = problem;
        this.content = content;
        this.optionOrder = optionOrder;
    }
}
