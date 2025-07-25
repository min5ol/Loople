package com.loople.backend.v2.domain.myRoomItem.dto;

import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;

public record MyRoomItemResponse(
        RoomItemSlot slot,
        String itemName,
        String imageUrl
) {}
