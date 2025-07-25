package com.loople.backend.v2.domain.roomItem.service;

import com.loople.backend.v2.domain.roomItem.dto.RoomItemResponse;
import com.loople.backend.v2.domain.roomItem.entity.RoomItem;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;
import com.loople.backend.v2.domain.roomItem.repository.RoomItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomItemServiceImpl implements RoomItemService
{
    private final RoomItemRepository roomItemRepository;

    private RoomItemResponse toDto(RoomItem item)
    {
        return new RoomItemResponse(
                item.getNo(),
                item.getItemName(),
                item.getSlot(),
                item.getImageUrl(),
                item.getPointCost()
        );
    }

    @Override
    public List<RoomItemResponse> getAllItems()
    {
        return roomItemRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<RoomItemResponse> getItemBySlot(RoomItemSlot slot)
    {
        return roomItemRepository.findBySlot(slot).stream()
                .map(this::toDto)
                .toList();
    }
}
