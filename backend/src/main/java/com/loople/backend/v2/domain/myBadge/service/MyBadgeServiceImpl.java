package com.loople.backend.v2.domain.myBadge.service;

import com.loople.backend.v2.domain.badgeCatalog.entity.BadgeCatalog;
import com.loople.backend.v2.domain.badgeCatalog.repository.BadgeCatalogRepository;
import com.loople.backend.v2.domain.myBadge.dto.MyBadgeResponse;
import com.loople.backend.v2.domain.myBadge.entity.MyBadge;
import com.loople.backend.v2.domain.myBadge.repository.MyBadgeRepository;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.global.exception.CustomException;
import com.loople.backend.v2.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyBadgeServiceImpl implements MyBadgeService
{
    private final MyBadgeRepository myBadgeRepository;
    private final BadgeCatalogRepository badgeCatalogRepository;

    @Override
    public List<MyBadgeResponse> getMyBadges(Long userNo)
    {
        return myBadgeRepository.findByUser_No(userNo).stream()
                .map(b -> new MyBadgeResponse(
                        b.getBadgeCatalog().getNo(),
                        b.getBadgeCatalog().getBadgeName(),
                        b.getBadgeCatalog().getDescription(),
                        b.getBadgeCatalog().getImageUrl(),
                        b.isEquipped()))
                .toList();
    }

    @Override
    public MyBadge assignDefaultBadge(User user)
    {
        BadgeCatalog defaultBadge = badgeCatalogRepository.findAll().stream()
                .filter(b -> b.getBadgeName().equals("그린 루키"))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.BADGE_NOT_FOUND));

        MyBadge myBadge = MyBadge.builder()
                .user(user)
                .badgeCatalog(defaultBadge)
                .isEquipped(true)
                .build();

        return myBadgeRepository.save(myBadge);
    }

    @Override
    public void equipBadge(Long userNo, Long badgeNo)
    {
        MyBadge equipped = myBadgeRepository.findByUser_NoAndIsEquippedTrue(userNo);

        if(equipped != null)
        {
            equipped.unEquip();
        }

        MyBadge toEquip = myBadgeRepository.findById(badgeNo)
                .orElseThrow(() -> new IllegalArgumentException("뱃지를 찾을 수 없습니다."));
        toEquip.equip();
    }
}
