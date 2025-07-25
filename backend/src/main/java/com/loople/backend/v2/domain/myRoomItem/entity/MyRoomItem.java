package com.loople.backend.v2.domain.myRoomItem.entity;

import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import com.loople.backend.v2.domain.roomItem.entity.RoomItem;
import com.loople.backend.v2.domain.roomItem.entity.RoomItemSlot;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "my_room_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyRoomItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private MyRoom room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomItemSlot slot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_item_id", nullable = false)
    private RoomItem equippedItem;

    public void changeItem(RoomItem newItem)
    {
        this.equippedItem = newItem;
    }
}
