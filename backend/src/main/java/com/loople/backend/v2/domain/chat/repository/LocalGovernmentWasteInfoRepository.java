package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.LocalGovernmentWasteInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LocalGovernmentWasteInfoRepository extends JpaRepository<LocalGovernmentWasteInfo, Long> {
    List<LocalGovernmentWasteInfo> findBySidoAndSigungu(String sido, String sigungu);
}
