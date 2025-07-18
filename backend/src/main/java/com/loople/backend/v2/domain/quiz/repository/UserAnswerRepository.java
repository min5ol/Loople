package com.loople.backend.v2.domain.quiz.repository;

import com.loople.backend.v2.domain.quiz.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    Optional<UserAnswer> findByUserIdAndSolvedDate(Long userId, LocalDate solvedDate);
}
