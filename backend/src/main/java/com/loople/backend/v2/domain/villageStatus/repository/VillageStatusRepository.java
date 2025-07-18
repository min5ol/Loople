/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 마을 상태(village_status) 테이블에 접근하는 JPA Repository
 *       - 기본 CRUD 기능 제공
 *       - dongCode(법정동 코드) 기반 존재 여부 확인 지원
 */

package com.loople.backend.v2.domain.villageStatus.repository;

import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VillageStatusRepository extends JpaRepository<VillageStatus, Long> {

    // 특정 dongCode가 마을 상태 테이블에 존재하는지 여부 확인
    boolean existsByDongCode(String dongCode);
}