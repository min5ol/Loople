package com.loople.backend.v2.domain.badgeCatalog.repository;

import com.loople.backend.v2.domain.badgeCatalog.entity.BadgeCatalog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeCatalogRepository extends JpaRepository<BadgeCatalog, Long>
{
    boolean existsByBadgeName(String badgeName);
}
