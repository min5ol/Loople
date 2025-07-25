package com.loople.backend.v2.domain.myLoopling.dto;

public record MyLooplingResponse(
        Long looplingId,
        String name,
        String imageUrl,
        String description,
        boolean isEquipped
) {}
