package com.loople.backend.v2.domain.myRoomItem.service;

import com.loople.backend.v2.domain.myRoomItem.dto.MyRoomItemResponse;

import java.util.List;

public interface MyRoomItemService
{
    List<MyRoomItemResponse> getEquippedItems(Long roomNo);
    void equipItem(Long roomNo, Long roomItemId);
}
