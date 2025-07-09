/**
 * 사용자 리포지토리
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.repository;

import com.loople.backend.v1.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 사용자 데이터베이스 접근
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * ID로 사용자 조회
     * @param id - 사용자 PK
     * @return Optional<User>
     */
    Optional<User> findById(Long id);
}
