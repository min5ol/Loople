package com.loople.backend.v2.domain.quiz.repository;

import com.loople.backend.v2.domain.quiz.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

}
