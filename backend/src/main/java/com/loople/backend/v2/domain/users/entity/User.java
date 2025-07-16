/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: users 테이블 매핑 엔티티, 회원가입 및 유저 정보 저장 역할
 */

package com.loople.backend.v2.domain.users.entity;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import com.loople.backend.v2.domain.mybadge.entity.MyBadge;
import com.loople.backend.v2.domain.myplants.entity.MyPlant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String name;

    @Column(unique = true)
    private String nickname;

    @Column(unique = true)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dong_code", referencedColumnName = "dong_code", nullable = false)
    private Beopjeongdong beopjeongdong;

    private String address;

    @Column(name = "detail_address")
    private String detailAddress;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(name = "social_id")
    private String socialId;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;

    private int points;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id")
    private MyPlant plant;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id")
    private MyBadge badge;

    // 최초 생성 시 값 세팅
    @PrePersist
    protected void onCreate()
    {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isDeleted = false;
        this.points = 0;
        this.role = Role.USER;
        this.provider = Provider.LOCAL;
    }

    // 수정 시 갱신
    @PreUpdate
    protected void onUpdate()
    {
        this.updatedAt = LocalDateTime.now();
    }
}
