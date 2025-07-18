package com.loople.backend.v2.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdatedUserPointRequest {
    private Long userId;
    private int points;
}
