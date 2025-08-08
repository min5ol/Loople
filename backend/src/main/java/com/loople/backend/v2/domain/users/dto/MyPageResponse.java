package com.loople.backend.v2.domain.users.dto;

import java.util.List;

public record MyPageResponse(
        String profileImageUrl,
        String email,
        String phone,
        String nickname,
        int points,
        List<Integer> attendanceDays
) {}
