package com.loople.backend.v2.domain.users.dto;

import com.loople.backend.v2.domain.users.entity.SignupStatus;

public record SocialSignupResponse(
        Long userId,
        String nickname,
        String token,
        SignupStatus signupStatus
) {}
