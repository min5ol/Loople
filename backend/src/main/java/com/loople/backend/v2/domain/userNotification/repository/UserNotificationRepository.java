/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 알람 설정 테이블에 접근하는 Repository
 */

package com.loople.backend.v2.domain.userNotification.repository;

import com.loople.backend.v2.domain.userNotification.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long>
{}
