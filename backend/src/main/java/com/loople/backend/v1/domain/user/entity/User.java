/**
 * 사용자 엔티티
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

import javax.swing.text.DateFormatter;
import java.time.LocalDateTime;

/**
 * 사용자 정보 테이블 매핑
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false, unique = true)
    private String email; // 사용자 이메일

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl; // 프로필 이미지 URL

    @Column(name = "password_hash")
    private String password;
    private String name;
    private String nickname;
    private String phone;

    @Column(name = "residence_id")
    private Long residenceId; //법정동 코드

    @Column(name="detail_address")
    private String detailAddress;   //상세 주소
    private String provider;    //enum("local", "google", "kakao", "naver", "apple")

    @Column(name="social_id")
    private String socialId;
    private String role;    //enum("USER", "ADMIN")

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name="isDeleted")
    private boolean isDeleted;

    @Column(name="deleted_at")
    private LocalDateTime deletedAt;

    /**
     * 프로필 이미지 URL 수정
     * @param imageUrl - 새 이미지 URL
     */
    public void updateProfileImageUrl(String imageUrl) {
        this.profileImageUrl = imageUrl; // 이미지 URL 갱신
    }

    public void updateResidenceId(Long dongCode){ this.residenceId = dongCode; }
}
