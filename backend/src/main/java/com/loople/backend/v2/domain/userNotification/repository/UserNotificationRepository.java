/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자 알림 설정(UserNotification) 테이블에 접근하는 JPA Repository
 *       - 기본적인 CRUD 기능을 상속받아 사용
 *       - 사용자 ID 기준 조회 등은 추후 메서드 정의 가능
 */

package com.loople.backend.v2.domain.userNotification.repository;

import com.loople.backend.v2.domain.userNotification.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long>
{
    // 기본 제공되는 findById, save, deleteById 등 사용 가능
    // 필요시: Optional<UserNotification> findByUserId(Long userId); 와 같은 커스텀 메서드 추가 가능
}