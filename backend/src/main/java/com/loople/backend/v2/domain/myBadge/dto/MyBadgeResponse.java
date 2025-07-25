package com.loople.backend.v2.domain.myBadge.dto;

public record MyBadgeResponse(
        Long badgeNo,
        String badgeName,
        String description,
        String imageUrl,
        boolean isEquipped
) {}
