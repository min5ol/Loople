/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 마을(법정동) 단위의 성장 상태를 저장하는 엔티티
 */

package com.loople.backend.v2.domain.villageStatus.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "village_status")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class VillageStatus
{
    @Id
    @Column(name = "dong_code")
    private String dongCode;

    private int level;
    private int points;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate()
    {
        this.level = 1;
        this.points = 0;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate()
    {
        this.updatedAt = LocalDateTime.now();
    }
}
