/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 유저가 소유한 식물 정보를 저장하는 엔티티
 *       - 어떤 식물(PlantCatalog)을 선택했는지, 성장 단계, 획득 시각 등을 포함
 *       - User, PlantCatalog와 다대일 연관관계
 */

package com.loople.backend.v2.domain.myplants.entity;

import com.loople.backend.v2.domain.plantCatalog.entity.PlantCatalog;
import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_plants") // 매핑될 테이블 이름 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyPlant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 PK
    private Long no; // 식물 소유 ID

    @ManyToOne(fetch = FetchType.LAZY) // 유저와 다대일 관계 (지연 로딩)
    @JoinColumn(name = "user_id") // 외래키 컬럼
    private User user; // 해당 식물을 보유한 유저

    private boolean isSelected; // 현재 대표 식물 여부

    @Column(name = "acquired_at") // 획득 일시
    private LocalDateTime acquiredAt; // 식물 획득 시각

    @Enumerated(EnumType.STRING) // Enum을 문자열로 저장
    private GrowthStage growthStage; // 성장 단계 (예: 씨앗, 새싹, 꽃 등)

    @ManyToOne(fetch = FetchType.LAZY) // 식물 카탈로그와 다대일 관계
    @JoinColumn(name = "plant_id") // 연결된 식물 ID
    private PlantCatalog plant; // 어떤 종류의 식물인지
}