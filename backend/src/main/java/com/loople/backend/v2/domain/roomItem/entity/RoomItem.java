package com.loople.backend.v2.domain.roomItem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RoomItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false, unique = true)
    private String itemName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomItemSlot slot;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private int pointCost;
}
