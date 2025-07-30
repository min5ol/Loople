package com.loople.backend.v2.domain.myVillage.service;

import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
import com.loople.backend.v2.domain.users.entity.User;

public interface MyVillageService
{
    MyVillage assignVillage(User user, String dongCodePrefix);
}
