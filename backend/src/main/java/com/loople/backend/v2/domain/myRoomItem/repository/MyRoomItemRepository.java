package com.loople.backend.v2.domain.myRoomItem.repository;

import com.loople.backend.v2.domain.myRoomItem.entity.MyRoomItem;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyRoomItemRepository extends JpaRepository<MyRoomItem, Long>
{
    List<MyRoomItem> findByRoom_No(Long roomNo);
    Optional<MyRoomItem> findByRoom_NoAndSlot(Long roomNo, RoomItemSlot slot);
}
