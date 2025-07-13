package com.loople.backend.v1.domain.dongcode.repository;

import com.loople.backend.v1.domain.dongcode.entity.AdministrativeDong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdministrativeDongRepository extends JpaRepository<AdministrativeDong, Long> {

    List<AdministrativeDong> findBySidoAndSigunguAndEupmyun(String sido, String sigungu, String eupmyun);

    // ri 없이 검색
    List<AdministrativeDong> findBySidoAndSigunguAndEupmyunAndOrder(
            String sido, String sigungu, String eupmyun, int order);

    // ri 포함 검색
    List<AdministrativeDong> findBySidoAndSigunguAndEupmyunAndRiNameAndOrder(
            String sido, String sigungu, String eupmyun, String riName, int order);
}
