/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: MultipleOption 엔티티에 대한 JPA Repository 인터페이스
*/
package com.loople.backend.v2.domain.quiz.repository;

import com.loople.backend.v2.domain.quiz.entity.MultipleOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MultipleOptionRepository extends JpaRepository<MultipleOption, Long> {
    //JpaRepository를 상속 받아 MultipleOption 엔티티의 기본 CRUD 메서드가 자동 구현
}
