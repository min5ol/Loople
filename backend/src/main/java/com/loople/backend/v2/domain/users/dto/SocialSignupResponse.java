package com.loople.backend.v2.domain.users.dto;

public record SocialSignupResponse(
        Long userId,
        String nickname,
        String token
) {}
