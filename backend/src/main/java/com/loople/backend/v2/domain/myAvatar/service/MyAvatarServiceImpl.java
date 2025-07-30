package com.loople.backend.v2.domain.myAvatar.service;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItem;
import com.loople.backend.v2.domain.avatarItem.entity.AvatarItemType;
import com.loople.backend.v2.domain.avatarItem.repository.AvatarItemRepository;
import com.loople.backend.v2.domain.myAvatar.entity.MyAvatar;
import com.loople.backend.v2.domain.myAvatar.repository.MyAvatarRepository;
import com.loople.backend.v2.domain.users.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyAvatarServiceImpl implements MyAvatarService
{
    private final AvatarItemRepository avatarItemRepository;
    private final MyAvatarRepository myAvatarRepository;

    @Override
    public MyAvatar createDefaultAvatar(User user)
    {
        List<AvatarItemType> neededTypes = List.of(
                AvatarItemType.HAIR,
                AvatarItemType.HAIRACC,
                AvatarItemType.EYE,
                AvatarItemType.TOP,
                AvatarItemType.BOTTOM,
                AvatarItemType.FULLBODY,
                AvatarItemType.FACEACC,
                AvatarItemType.LEFTHAND,
                AvatarItemType.RIGHTHAND,
                AvatarItemType.BODYACC,
                AvatarItemType.SOCKS,
                AvatarItemType.SHOES
        );

        List<AvatarItem> items = avatarItemRepository.findByTypeIn(neededTypes);

        Map<AvatarItemType, AvatarItem> itemMap = items.stream()
                .collect(Collectors.toMap(
                        AvatarItem::getType,
                        item -> item,
                        (a, b) -> a
                ));

        log.info("아바타 지급 시작");
        long start = System.currentTimeMillis();

        MyAvatar avatar = MyAvatar.builder()
                .user(user)
                .hair(itemMap.get(AvatarItemType.HAIR))
                .hairAcc(itemMap.get(AvatarItemType.HAIRACC))
                .eye(itemMap.get(AvatarItemType.EYE))
                .top(itemMap.get(AvatarItemType.TOP))
                .bottom(itemMap.get(AvatarItemType.BOTTOM))
                .fullBody(itemMap.get(AvatarItemType.FULLBODY))
                .faceAcc(itemMap.get(AvatarItemType.FACEACC))
                .leftHand(itemMap.get(AvatarItemType.LEFTHAND))
                .rightHand(itemMap.get(AvatarItemType.RIGHTHAND))
                .bodyAcc(itemMap.get(AvatarItemType.BODYACC))
                .socks(itemMap.get(AvatarItemType.SOCKS))
                .shoes(itemMap.get(AvatarItemType.SHOES))
                .build();

        MyAvatar saved = myAvatarRepository.save(avatar);
        user.assignAvatar(saved);

        log.info("✅ 아바타 지급 완료, 소요 시간: {}ms", System.currentTimeMillis() - start);

        return saved;
    }
}
