package com.loople.backend.v2.domain.myAvatar.service;

import com.loople.backend.v2.domain.myAvatar.entity.MyAvatar;
import com.loople.backend.v2.domain.users.entity.User;

public interface MyAvatarService
{
    MyAvatar createDefaultAvatar(User user);
}
