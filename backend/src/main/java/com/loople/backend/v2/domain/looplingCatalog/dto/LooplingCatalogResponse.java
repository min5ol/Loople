package com.loople.backend.v2.domain.looplingCatalog.dto;

public record LooplingCatalogResponse(
        Long no,
        String name,
        String imageUrl,
        String description
) {}
