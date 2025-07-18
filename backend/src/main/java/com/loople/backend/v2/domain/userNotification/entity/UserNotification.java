/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 사용자별 알림 설정을 저장하는 엔티티
 *       - 쓰레기 배출일, 퀴즈 관련 알림 여부
 *       - FCM 푸시 알림을 위한 토큰 저장
 *       - 추후 알림 내역 엔티티와의 확장도 가능
 */

package com.loople.backend.v2.domain.userNotification.entity;

import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_notification") // 매핑될 테이블 이름
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자
@AllArgsConstructor
@Builder
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 PK
    private Long no; // 알림 설정 고유 ID

    @OneToOne(fetch = FetchType.LAZY) // 유저당 하나의 알림 설정만 존재
    @JoinColumn(name = "user_id", unique = true) // 외래키 및 유니크 제약
    private User user; // 알림 설정을 가진 유저

    @Column(name = "waste_day_alert") // 쓰레기 배출일 알림 여부
    private Boolean wasteDayAlert;

    @Column(name = "quiz_progress_alert") // 퀴즈 진행 알림 여부
    private Boolean quizProgressAlert;

    @Column(columnDefinition = "TEXT") // 푸시 발송용 FCM 토큰
    private String fcmToken;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now(); // 생성 시각 기본값

    /**
     * 유저를 입력받아 기본 알림 설정(true)로 초기화된 객체를 생성
     */
    public static UserNotification of(User user) {
        return UserNotification.builder()
                .user(user)
                .wasteDayAlert(true)
                .quizProgressAlert(true)
                .build();
    }
}