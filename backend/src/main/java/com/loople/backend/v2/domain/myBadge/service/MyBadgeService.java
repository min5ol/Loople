package com.loople.backend.v2.domain.myBadge.service;

import com.loople.backend.v2.domain.myBadge.dto.MyBadgeResponse;
import com.loople.backend.v2.domain.myBadge.entity.MyBadge;

import java.util.List;

public interface MyBadgeService
{
    List<MyBadgeResponse> getMyBadges(Long userNo);
    MyBadge assignDefaultBadge();
    void equipBadge(Long userNo, Long badgeNo);
}
