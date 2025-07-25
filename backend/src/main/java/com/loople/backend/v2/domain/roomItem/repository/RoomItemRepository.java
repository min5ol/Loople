package com.loople.backend.v2.domain.roomItem.repository;

import com.loople.backend.v2.domain.roomItem.entity.RoomItem;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomItemRepository extends JpaRepository<RoomItem, Long>
{
    List<RoomItem> findBySlot(RoomItemSlot slot);
}
