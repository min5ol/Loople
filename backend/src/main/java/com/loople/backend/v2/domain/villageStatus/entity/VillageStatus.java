/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 마을(법정동) 단위의 성장 상태를 저장하는 엔티티
 *       - 특정 동코드의 성장 레벨과 포인트를 관리
 *       - 사용자들의 활동 결과가 이 엔티티에 누적됨
 */

package com.loople.backend.v2.domain.villageStatus.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "village_status") // 매핑 테이블명
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자
@AllArgsConstructor
public class VillageStatus {

    @Id
    @Column(name = "dong_code")
    private String dongCode; // 법정동 코드 (Primary Key)

    private int level;       // 현재 마을 성장 레벨
    private int points;      // 누적 포인트

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 마지막 업데이트 일시

    /**
     * 최초 저장 시 초기값 설정
     * - 레벨: 1
     * - 포인트: 0
     * - 수정일시: 현재 시간
     */
    @PrePersist
    protected void onCreate() {
        this.level = 1;
        this.points = 0;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 갱신 시점에 수정일시 갱신
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}