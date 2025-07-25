package com.loople.backend.v2.domain.myRoomItem.service;

import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import com.loople.backend.v2.domain.myRoom.repository.MyRoomRepository;
import com.loople.backend.v2.domain.myRoomItem.dto.MyRoomItemResponse;
import com.loople.backend.v2.domain.myRoomItem.entity.MyRoomItem;
import com.loople.backend.v2.domain.myRoomItem.repository.MyRoomItemRepository;
import com.loople.backend.v2.domain.roomItem.entity.RoomItem;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;
import com.loople.backend.v2.domain.roomItem.repository.RoomItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyRoomItemServiceImpl implements MyRoomItemService
{
    private final MyRoomItemRepository myRoomItemRepository;
    private final MyRoomRepository myRoomRepository;
    private final RoomItemRepository roomItemRepository;

    @Override
    public List<MyRoomItemResponse> getEquippedItems(Long roomNo)
    {
        return myRoomItemRepository.findByRoom_No(roomNo).stream()
                .map(item -> new MyRoomItemResponse(
                        item.getSlot(),
                        item.getEquippedItem().getItemName(),
                        item.getEquippedItem().getImageUrl()
                )).toList();
    }

    @Override
    public void equipItem(Long roomNo, Long roomItemId)
    {
        RoomItem item = roomItemRepository.findById(roomItemId)
                .orElseThrow(() -> new IllegalArgumentException("방 아이템을 찾을 수 없습니다."));

        RoomItemSlot slot = item.getSlot();

        MyRoom room = myRoomRepository.findById(roomNo)
                .orElseThrow(() -> new IllegalArgumentException("방을 찾을 수 없습니다."));

        MyRoomItem equipped = myRoomItemRepository.findByRoom_NoAndSlot(roomNo, slot).orElse(null);
        if(equipped != null)
        {
            equipped.changeItem(item);
        }
        else
        {
            myRoomItemRepository.save(MyRoomItem.builder()
                    .room(room)
                    .slot(slot)
                    .equippedItem(item)
                    .build());
        }
    }
}
