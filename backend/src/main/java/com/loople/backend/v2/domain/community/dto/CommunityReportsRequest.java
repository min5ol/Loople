package com.loople.backend.v2.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class CommunityReportsRequest {
    private Long no;
    private Long userId;
    private Long boardId;
    private Long commentId;
    private String category;
    private String reason;
}
