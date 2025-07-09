/**
 * 사용자 엔티티
 * 작성자: 장민솔
 * 작성일: 2025-07-09
 */
package com.loople.backend.v1.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 사용자 정보 테이블 매핑
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @Column(nullable = false, unique = true)
    private String email; // 사용자 이메일

    @Column(name = "profile_image_url")
    private String profileImageUrl; // 프로필 이미지 URL

    /**
     * 프로필 이미지 URL 수정
     * @param imageUrl - 새 이미지 URL
     */
    public void updateProfileImageUrl(String imageUrl) {
        this.profileImageUrl = imageUrl; // 이미지 URL 갱신
    }
}
