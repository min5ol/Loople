package com.loople.backend.v2.domain.myAvatar.entity;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItem;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "my_avatar")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyAvatar
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @OneToOne
    @JoinColumn(name = "hair_item_id")
    private AvatarItem hair;

    @OneToOne
    @JoinColumn(name = "hairAcc_item_id")
    private AvatarItem hairAcc;

    @OneToOne
    @JoinColumn(name = "eye_item_id")
    private AvatarItem eye;

    @OneToOne
    @JoinColumn(name = "top_item_id")
    private AvatarItem top;

    @OneToOne
    @JoinColumn(name = "bottom_item_id")
    private AvatarItem bottom;

    @OneToOne
    @JoinColumn(name = "fullBody_item_id")
    private AvatarItem fullBody;

    @OneToOne
    @JoinColumn(name = "faceAcc_item_id")
    private AvatarItem faceAcc;

    @OneToOne
    @JoinColumn(name = "leftHand_item_id")
    private AvatarItem leftHand;

    @OneToOne
    @JoinColumn(name = "rightHand_item_id")
    private AvatarItem rightHand;

    @OneToOne
    @JoinColumn(name = "bodyAcc_item_id")
    private AvatarItem bodyAcc;

    @OneToOne
    @JoinColumn(name = "socks_item_id")
    private AvatarItem socks;

    @OneToOne
    @JoinColumn(name = "shoes_item_id")
    private AvatarItem shoes;

    public void equip(AvatarItem item)
    {
        switch (item.getType())
        {
            case HAIR -> this.hair = item;
            case HAIRACC -> this.hairAcc = item;
            case EYE -> this.eye = item;
            case TOP -> this.top = item;
            case BOTTOM -> this.bottom = item;
            case FULLBODY -> this.fullBody = item;
            case FACEACC -> this.faceAcc = item;
            case LEFTHAND -> this.leftHand = item;
            case RIGHTHAND -> this.rightHand = item;
            case BODYACC -> this.bodyAcc = item;
            case SOCKS -> this.socks = item;
            case SHOES -> this.shoes = item;
        }
    }
}
