package com.loople.backend.v2.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfoResponse {
    private Long no;
    private String nickname;
    private String email;
}
