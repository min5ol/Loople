package com.loople.backend.v2.domain.users.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserLoginRequest(
        @JsonProperty("email") String email,
        @JsonProperty("password") String password
) {}
