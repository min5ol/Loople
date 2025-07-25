package com.loople.backend.v2.domain.badgeCatalog.service;

import com.loople.backend.v2.domain.badgeCatalog.dto.BadgeCatalogResponse;

import java.util.List;

public interface BadgeCatalogService
{
    List<BadgeCatalogResponse> getAllBadges();
}
