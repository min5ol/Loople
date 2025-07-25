package com.loople.backend.v2.domain.roomItem.dto;

import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;

public record RoomItemResponse(
        Long no,
        String itemName,
        RoomItemSlot slot,
        String imageUrl,
        int pointCost
) {}
