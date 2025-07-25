package com.loople.backend.v2.domain.myRoom.controller;

import com.loople.backend.v2.domain.myRoom.dto.MyRoomResponse;
import com.loople.backend.v2.domain.myRoom.service.MyRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/my-room")
@RequiredArgsConstructor
public class MyRoomController
{
    private final MyRoomService myRoomService;

    @GetMapping("/{userNo}")
    public ResponseEntity<MyRoomResponse> getMyRoom(@PathVariable Long userNo)
    {
        return ResponseEntity.ok(myRoomService.getMyRoom(userNo));
    }
}
