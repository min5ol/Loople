/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 사용자 답변 정보를 저장하는 엔티티 클래스
*/
package com.loople.backend.v2.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="quiz_user_answer")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;    //답변 고유 번호(PK)

    @Column(name="user_id")
    private Long userId;    //사용자 고유 번호(FK)

    @Column(name="user_email")
    private String userEmail;

    @Column(name="problem_id")
    private Long problemId; //문제 고유 번호(FK)

    @Column(name="submitted_answer")
    private String submittedAnswer; //사용자 제출 답안

    @Column(name="is_correct")
    private int isCorrect;  //정답 여부(1: 정답, 0: 오답)

    @Column(name="is_weekly")
    private int isWeekly;   //주간 접속 여부(1: TRUE, 0: FALSE)

    @Column(name="is_monthly")
    private int isMonthly;  //월간 접속 여부(1: TRUE, 0: FALSE)

    //참가(오답) 3, 정답 7, 주간 20, 월간 100
    private int points; //획득한 포인트 점수

    @Column(name="solved_at")
    private LocalDate solvedAt; //문제 풀이 날짜

    @Builder
    public UserAnswer(Long userId, String userEmail, Long problemId, String submittedAnswer, int isCorrect, int isWeekly, int isMonthly, int points, LocalDate solvedAt) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.problemId = problemId;
        this.submittedAnswer = submittedAnswer;
        this.isCorrect = isCorrect;
        this.isWeekly = isWeekly;
        this.isMonthly = isMonthly;
        this.points = points;
        this.solvedAt = solvedAt;
    }
}
