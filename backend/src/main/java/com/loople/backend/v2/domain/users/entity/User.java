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
import com.loople.backend.v2.domain.mybadge.entity.MyBadge;
import com.loople.backend.v2.domain.myplants.entity.MyPlant;
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

    private String name; // 실명

    @Column(unique = true)
    private String nickname; // 닉네임 (중복 불가)

    @Column(unique = true)
    private String phone; // 휴대폰 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dong_code", referencedColumnName = "dong_code", nullable = false)
    private Beopjeongdong beopjeongdong; // 주소 기반 법정동 엔티티 (외래키)

    private String address; // 전체 주소 문자열

    @Column(name = "detail_address")
    private String detailAddress; // 건물명, 호수 등 상세주소

    @Enumerated(EnumType.STRING)
    private Provider provider; // 가입 방식 (LOCAL, KAKAO 등)

    @Column(name = "social_id")
    private String socialId; // 소셜 로그인 식별자

    @Enumerated(EnumType.STRING)
    private Role role; // 권한 (USER, ADMIN)

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 최초 생성일

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 마지막 수정일

    @Column(name = "is_deleted")
    private Boolean isDeleted; // 탈퇴 여부

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 탈퇴일시

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl; // S3에 저장된 프로필 이미지 경로

    private int points; // 유저가 보유한 포인트

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id")
    private MyPlant plant; // 현재 대표 식물

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id")
    private MyBadge badge; // 대표 배지

    /**
     * 회원 최초 생성 시 초기값 세팅
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // 생성일자 설정
        this.updatedAt = LocalDateTime.now(); // 최초 생성 시점 = 수정 시점
        this.isDeleted = false;               // 기본값 false
        this.points = 0;                      // 기본 포인트 0
        this.role = Role.USER;                // 기본 권한 USER
        this.provider = Provider.LOCAL;       // 기본 가입 방식 LOCAL
    }

    /**
     * 회원 정보 수정 시 수정일 갱신
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /*
        작성일자: 2025-07-18
        작성자: 백진선
        설명: 사용자 포인트를 누적 값으로 더하는 메서드
    */
    public void addPoints(int pointsToAdd){
        this.points += pointsToAdd;
    }
}