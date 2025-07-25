package com.loople.backend.v2.domain.myAvatarItem.dto;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItemType;

public record MyAvatarItemResponse(
        Long avatarItemId,
        String itemName,
        AvatarItemType type,
        String imageUrl
) {}
