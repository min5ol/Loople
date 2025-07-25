/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔, 백진선
 * 설명: users 테이블에 매핑되는 JPA 엔티티 클래스
 *       - 회원가입 시 사용자 정보를 저장
 *       - 동코드(법정동) 기반 지역 정보 연결
 *       - 프로필, 식물, 배지, 알림 등 서비스 기능과 연동됨
 */

package com.loople.backend.v2.domain.users.entity;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.myBadge.entity.MyBadge;
import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no; // 사용자 고유 번호 (PK)

    @Email
    @Column(unique = true)
    private String email; // 사용자 이메일 (로그인 ID)

    @Column(name = "password_hash")
    private String passwordHash; // 비밀번호 해시 값

    @Column(nullable = false)
    private String name; // 실명

    @Column(nullable = false, unique = true)
    private String nickname; // 닉네임 (중복 불가)

    @Column(nullable = false, unique = true)
    private String phone; // 휴대폰 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dong_code", referencedColumnName = "dong_code", nullable = false)
    private Beopjeongdong beopjeongdong; // 주소 기반 법정동 엔티티 (외래키)

    @Column(name = "address", nullable = false)
    private String address; // 전체 주소 문자열

    @Column(name = "detail_address")
    private String detailAddress; // 건물명, 호수 등 상세주소

    @Enumerated(EnumType.STRING)
    private Provider provider; // 가입 방식 (LOCAL, KAKAO 등)

    @Column(name = "social_id")
    private String socialId; // 소셜 로그인 식별자

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER; // 권한 (USER, ADMIN)

    @Enumerated(EnumType.STRING)
    @Column(name = "signup_status")
    @Builder.Default
    private SignupStatus signupStatus = SignupStatus.PENDING; // 가입 상태

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl; // S3에 저장된 프로필 이미지 경로

    @Builder.Default
    private int points = 0; // 유저가 보유한 포인트

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 탈퇴일시

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id", referencedColumnName = "no")
    private MyVillage village;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", referencedColumnName = "no")
    private MyRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id", referencedColumnName = "no")
    private MyBadge badge;

    @PrePersist
    protected void onCreate()
    {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate()
    {
        this.updatedAt = LocalDateTime.now();
    }

    /*
        작성일자: 2025-07-18
        작성자: 백진선
        설명: 사용자 포인트를 누적 값으로 더하는 메서드
    */
    public void addPoints(int pointsToAdd)
    {
        this.points += pointsToAdd;
    }
}