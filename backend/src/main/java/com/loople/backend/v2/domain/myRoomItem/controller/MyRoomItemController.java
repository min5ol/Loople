package com.loople.backend.v2.domain.myRoomItem.controller;

import com.loople.backend.v2.domain.myRoomItem.dto.MyRoomItemResponse;
import com.loople.backend.v2.domain.myRoomItem.service.MyRoomItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/my-room-items")
@RequiredArgsConstructor
public class MyRoomItemController
{
    private final MyRoomItemService myRoomItemService;

    @GetMapping("/{roomNo}")
    public ResponseEntity<List<MyRoomItemResponse>> getEquippedItems(@PathVariable Long roomNo)
    {
        return ResponseEntity.ok(myRoomItemService.getEquippedItems(roomNo));
    }

    @PostMapping("/{roomNo}/equip/{roomItemId}")
    public ResponseEntity<Void> equipItem(
            @PathVariable Long roomNo,
            @PathVariable Long roomItemId
    )
    {
        myRoomItemService.equipItem(roomNo, roomItemId);
        return ResponseEntity.ok().build();
    }
}
