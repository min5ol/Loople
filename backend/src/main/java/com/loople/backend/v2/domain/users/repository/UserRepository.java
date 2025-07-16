/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: User 테이블 접근을 위한 JPA Repository
 */

package com.loople.backend.v2.domain.users.repository;

import com.loople.backend.v2.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>
{
    Optional<User> findByEmail(String email);
}
