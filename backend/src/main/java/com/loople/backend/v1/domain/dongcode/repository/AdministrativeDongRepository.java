/**
 * 행정동 리포지토리
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.repository;

import com.loople.backend.v1.domain.dongcode.entity.AdministrativeDong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 행정동 데이터베이스 접근
 */
public interface AdministrativeDongRepository extends JpaRepository<AdministrativeDong, Long> {

    /**
     * 시도, 시군구, 읍면동으로 조회
     * @param sido - 시도
     * @param sigungu - 시군구
     * @param eupmyun - 읍면동
     * @return Optional<AdministrativeDong>
     */
    Optional<AdministrativeDong> findBySidoAndSigunguAndEupmyun(String sido, String sigungu, String eupmyun);
}
