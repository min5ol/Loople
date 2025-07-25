package com.loople.backend.v2.domain.myAvatarItem.entity;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItem;
import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "my_avatar_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyAvatarItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_item_id", nullable = false)
    private AvatarItem avatarItem;
}
