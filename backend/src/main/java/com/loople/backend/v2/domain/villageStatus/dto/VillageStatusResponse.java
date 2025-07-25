package com.loople.backend.v2.domain.villageStatus.dto;

public record VillageStatusResponse(
        Long villageId,
        int population,
        int totalPoints
) {}
