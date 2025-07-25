package com.loople.backend.v2.domain.myLoopling.service;

import com.loople.backend.v2.domain.myLoopling.dto.MyLooplingResponse;
import com.loople.backend.v2.domain.myLoopling.entity.MyLoopling;
import com.loople.backend.v2.domain.users.entity.User;

import java.util.List;

public interface MyLooplingService
{
    List<MyLooplingResponse> getMyLoopling(Long userNo);
    void equipLoopling(Long userNo, Long looplingId);
    MyLoopling create(String looplingType);
}
