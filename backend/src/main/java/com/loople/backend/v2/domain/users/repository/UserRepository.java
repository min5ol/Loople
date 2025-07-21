/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: users 테이블에 접근하기 위한 JPA Repository 인터페이스
 *       - 기본 CRUD 제공
 *       - 이메일 기반 사용자 조회 기능 포함
 */

package com.loople.backend.v2.domain.users.repository;

import com.loople.backend.v2.domain.users.entity.Provider;
import com.loople.backend.v2.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 사용자 조회 (로그인 등에서 사용)
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    Optional<User> findByProviderAndSocialId(Provider provider, String socialId);
}