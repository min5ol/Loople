/*
    작성일자: 2025-07-17
    작성자: 백진선
    설명: UserAnswer 엔티티에 대한 데이터 접근을 담당하는 JPA Repository 인터페이스
*/
package com.loople.backend.v2.domain.quiz.repository;

import com.loople.backend.v2.domain.quiz.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    /**
     * 특정 사용자(userId)가 특정 날짜(solvedAt)에 제출한 답안을 조회
     * @param userId: 사용자 ID
     * @param solvedAt: 문제 풀이 날짜
     * @return 해당 날짜에 제출한 답안이 있을 경우 Optional에 담아 반환
     */
    Optional<UserAnswer> findByUserIdAndSolvedAt(Long userId, LocalDate solvedAt);

    /**
     * 특정 사용자(userId)가 특정 기간(weekAgo ~ today) 동안 제출한 답안 개수를 조회(출석 체크용)
     * @param userId: 사용자 ID
     * @param start: 기간 시작일 (예: 7일 전 날짜)
     * @param end: 기간 종료일 (예: 오늘 날짜)
     * @return 해당 기간 내 제출한 답안 개수
     */
    Long countAttendanceByUserIdAndSolvedAtBetween(Long userId, LocalDate start, LocalDate end);

    List<UserAnswer> findByUserIdAndSolvedAtBetween(Long userId, LocalDate start, LocalDate end);

    List<Long> findProblemIdByUserId(Long userId);
}
