package com.loople.backend.v2.domain.users.dto;

public record UpdatePhoneReqeust(
        String phone,
        String verificationCode
) {}
