package com.loople.backend.v2.domain.community.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class CommunityCommentResponse {
    private Long no;
    private Long userId;
    private String nickname;
    private Long boardId;
    private Long parentId;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}