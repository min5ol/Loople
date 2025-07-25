package com.loople.backend.v2.domain.roomItem.service;

import com.loople.backend.v2.domain.roomItem.dto.RoomItemResponse;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;

import java.util.List;

public interface RoomItemService
{
    List<RoomItemResponse> getAllItems();
    List<RoomItemResponse> getItemBySlot(RoomItemSlot slot);
}
