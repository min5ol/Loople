/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 식물 종류 정보를 저장하는 카탈로그 엔티티
 *       - 사용자가 선택 가능한 모든 식물 종류를 사전에 정의
 *       - 이름, 설명, 이미지 URL 포함
 */

package com.loople.backend.v2.domain.plantCatalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plant_catalog") // 식물 카탈로그 테이블과 매핑
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 (외부 사용 방지)
@AllArgsConstructor
@Builder
public class PlantCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 PK
    private Long no; // 식물 카탈로그 고유 번호

    @Column(nullable = false)
    private String name; // 식물 이름 (예: 선인장, 고무나무 등)

    @Column(columnDefinition = "TEXT")
    private String description; // 식물 설명 (특징, 관리 방법 등)

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl; // 식물 대표 이미지 URL
}