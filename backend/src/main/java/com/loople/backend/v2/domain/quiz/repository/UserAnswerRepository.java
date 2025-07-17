package com.loople.backend.v2.domain.quiz.repository;

import com.loople.backend.v2.domain.quiz.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
}
