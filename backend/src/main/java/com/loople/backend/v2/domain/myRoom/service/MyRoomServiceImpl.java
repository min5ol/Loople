package com.loople.backend.v2.domain.myRoom.service;

import com.loople.backend.v2.domain.myRoom.dto.MyRoomResponse;
import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import com.loople.backend.v2.domain.myRoom.repository.MyRoomRepository;
import com.loople.backend.v2.domain.users.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyRoomServiceImpl implements MyRoomService
{
    private final MyRoomRepository myRoomRepository;

    @Override
    public MyRoomResponse getMyRoom(Long userNo)
    {
        MyRoom myRoom = myRoomRepository.findByUser_No(userNo)
                .orElseThrow(() -> new IllegalArgumentException("방 정보가 없습니다."));

        return new MyRoomResponse(myRoom.getNo(), myRoom.getRoomName(), myRoom.getBackgroundColor());
    }

    @Override
    public MyRoom createDefaultRoom(User user)
    {
        MyRoom room = MyRoom.builder()
                .user(user)
                .roomName("나의 방")
                .backgroundColor("#FEF7E2")
                .build();

        return myRoomRepository.save(room);
    }
}
