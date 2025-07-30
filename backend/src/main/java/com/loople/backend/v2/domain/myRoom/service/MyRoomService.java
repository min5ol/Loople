package com.loople.backend.v2.domain.myRoom.service;

import com.loople.backend.v2.domain.myRoom.dto.MyRoomResponse;
import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import com.loople.backend.v2.domain.users.entity.User;

public interface MyRoomService
{
    MyRoomResponse getMyRoom(Long userNo);
    MyRoom createDefaultRoom(User user);
}
