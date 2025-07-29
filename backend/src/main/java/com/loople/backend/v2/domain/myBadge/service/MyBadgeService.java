package com.loople.backend.v2.domain.myBadge.service;

import com.loople.backend.v2.domain.myBadge.dto.MyBadgeResponse;
import com.loople.backend.v2.domain.myBadge.entity.MyBadge;
import com.loople.backend.v2.domain.users.entity.User;

import java.util.List;

public interface MyBadgeService
{
    List<MyBadgeResponse> getMyBadges(Long userNo);
    MyBadge assignDefaultBadge(User user);
    void equipBadge(Long userNo, Long badgeNo);
}
