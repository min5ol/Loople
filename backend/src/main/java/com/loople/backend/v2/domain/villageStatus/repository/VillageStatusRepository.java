package com.loople.backend.v2.domain.villageStatus.repository;

import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VillageStatusRepository extends JpaRepository<VillageStatus, Long>
{}
