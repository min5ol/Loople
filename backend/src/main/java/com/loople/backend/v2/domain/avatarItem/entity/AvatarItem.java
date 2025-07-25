package com.loople.backend.v2.domain.avatarItem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "avatar_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AvatarItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false)
    private String itemName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvatarItemType type;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private int pointCost;
}
