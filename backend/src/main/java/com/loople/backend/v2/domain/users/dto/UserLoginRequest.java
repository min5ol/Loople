package com.loople.backend.v2.domain.users.dto;

public record UserLoginRequest(
        String email,
        String password
) {}
