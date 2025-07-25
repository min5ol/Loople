package com.loople.backend.v2.domain.roomItem.controller;

import com.loople.backend.v2.domain.roomItem.dto.RoomItemResponse;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;
import com.loople.backend.v2.domain.roomItem.service.RoomItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v2/room-items")
@RequiredArgsConstructor
public class RoomItemController
{
    private final RoomItemService roomItemService;

    @GetMapping
    public ResponseEntity<List<RoomItemResponse>> getAllItems()
    {
        return ResponseEntity.ok(roomItemService.getAllItems());
    }

    @GetMapping("/slot/{slot}")
    public ResponseEntity<List<RoomItemResponse>> getBySlot(@PathVariable RoomItemSlot slot)
    {
        return ResponseEntity.ok(roomItemService.getItemBySlot(slot));
    }
}
