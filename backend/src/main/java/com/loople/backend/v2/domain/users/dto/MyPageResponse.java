package com.loople.backend.v2.domain.users.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record MyPageResponse(
        String nickname,
        String email,
        int points,
        List<String> badges,
        List<String> looplings
) {}
