package com.loople.backend.v2.domain.looplingCatalog.repository;

import com.loople.backend.v2.domain.looplingCatalog.entity.LooplingCatalog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LooplingCatalogRepository extends JpaRepository<LooplingCatalog, Long>
{
    boolean existsByName(String name);
}
