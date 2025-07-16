/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자별 알림 설정 저장 엔티티. 추후 알림 내역들 확장 가능
 */

package com.loople.backend.v2.domain.userNotification.entity;

import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_notification")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserNotification
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "waste_day_alert")
    private Boolean wasteDayAlert;

    @Column(name = "quiz_progress_alert")
    private Boolean quizProgressAlert;

    // FCM 토큰 (푸시 발송용)
    @Column(columnDefinition = "TEXT")
    private String fcmToken;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // 기본 알림 설정을 포함한 객체 생성
    public static UserNotification of(User user)
    {
        return UserNotification.builder()
                .user(user)
                .wasteDayAlert(true)
                .quizProgressAlert(true)
                .build();
    }
}
