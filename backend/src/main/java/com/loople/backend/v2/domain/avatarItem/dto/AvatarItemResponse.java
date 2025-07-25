package com.loople.backend.v2.domain.avatarItem.dto;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItemType;

public record AvatarItemResponse(
        Long no,
        String itemName,
        AvatarItemType type,
        String imageUrl,
        int pointCost
) {}
