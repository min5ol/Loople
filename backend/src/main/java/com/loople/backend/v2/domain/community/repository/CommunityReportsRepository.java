package com.loople.backend.v2.domain.community.repository;

import com.loople.backend.v2.domain.community.entity.CommunityReports;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityReportsRepository extends JpaRepository<CommunityReports, Long> {
}
