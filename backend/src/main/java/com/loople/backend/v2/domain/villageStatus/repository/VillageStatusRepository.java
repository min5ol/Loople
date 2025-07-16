/**
 * 작성일자: 2025-07-16
 * 작성자: 장민솔
 * 설명: 마을 상태 테이블에 접근하는 Repository
 */

package com.loople.backend.v2.domain.villageStatus.repository;

import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VillageStatusRepository extends JpaRepository<VillageStatus, Long>
{
    boolean existsByDongCode(String dongCode);
}
