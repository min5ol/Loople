package com.loople.backend.v2.domain.badgeCatalog.dto;

public record BadgeCatalogResponse(
        Long no,
        String badgeName,
        String description,
        String imageUrl,
        int pointRequirement
) {}
