/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: Problem 엔티티에 대한 JPA Repository 인터페이스
*/
package com.loople.backend.v2.domain.quiz.repository;

import com.loople.backend.v2.domain.quiz.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // JpaRepository 상속으로 Problem 엔티티의 CRUD 메서드가 자동 구현
}
