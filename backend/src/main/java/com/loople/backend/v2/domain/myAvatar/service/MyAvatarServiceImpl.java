package com.loople.backend.v2.domain.myAvatar.service;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItem;
import com.loople.backend.v2.domain.avatarItem.entity.AvatarItemType;
import com.loople.backend.v2.domain.avatarItem.repository.AvatarItemRepository;
import com.loople.backend.v2.domain.myAvatar.entity.MyAvatar;
import com.loople.backend.v2.domain.myAvatar.repository.MyAvatarRepository;
import com.loople.backend.v2.domain.users.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyAvatarServiceImpl implements MyAvatarService
{
    private final AvatarItemRepository avatarItemRepository;
    private final MyAvatarRepository myAvatarRepository;

    @Override
    public MyAvatar createDefaultAvatar(User user)
    {
        AvatarItem hair = avatarItemRepository.findByType(AvatarItemType.HAIR).stream().findFirst().orElse(null);
        AvatarItem hairAcc = avatarItemRepository.findByType(AvatarItemType.HAIRACC).stream().findFirst().orElse(null);
        AvatarItem eye = avatarItemRepository.findByType(AvatarItemType.EYE).stream().findFirst().orElse(null);
        AvatarItem top = avatarItemRepository.findByType(AvatarItemType.TOP).stream().findFirst().orElse(null);
        AvatarItem bottom = avatarItemRepository.findByType(AvatarItemType.BOTTOM).stream().findFirst().orElse(null);
        AvatarItem fullBody = avatarItemRepository.findByType(AvatarItemType.FULLBODY).stream().findFirst().orElse(null);
        AvatarItem faceAcc = avatarItemRepository.findByType(AvatarItemType.FACEACC).stream().findFirst().orElse(null);
        AvatarItem leftHand = avatarItemRepository.findByType(AvatarItemType.LEFTHAND).stream().findFirst().orElse(null);
        AvatarItem rightHand = avatarItemRepository.findByType(AvatarItemType.RIGHTHAND).stream().findFirst().orElse(null);
        AvatarItem bodyAcc = avatarItemRepository.findByType(AvatarItemType.BODYACC).stream().findFirst().orElse(null);
        AvatarItem socks = avatarItemRepository.findByType(AvatarItemType.SOCKS).stream().findFirst().orElse(null);
        AvatarItem shoes = avatarItemRepository.findByType(AvatarItemType.SHOES).stream().findFirst().orElse(null);

        MyAvatar avatar = MyAvatar.builder()
                .user(user)
                .hair(hair)
                .hairAcc(hairAcc)
                .eye(eye)
                .top(top)
                .bottom(bottom)
                .fullBody(fullBody)
                .faceAcc(faceAcc)
                .leftHand(leftHand)
                .rightHand(rightHand)
                .bodyAcc(bodyAcc)
                .socks(socks)
                .shoes(shoes)
                .build();

        return myAvatarRepository.save(avatar);
    }
}
