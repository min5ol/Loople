/**
 * 작성일자: 2025-07-18
 * 작성자: 백진선, 장민솔
 * 설명: 사용자 포인트 갱신 요청 DTO
 */

package com.loople.backend.v2.domain.users.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdatedUserPointRequest(
        @NotNull
        @Min(1)
        Integer points
){}