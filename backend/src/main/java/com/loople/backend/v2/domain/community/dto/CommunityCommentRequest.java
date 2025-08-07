package com.loople.backend.v2.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityCommentRequest {
    private Long no;
    private Long userId;
    private Long boardId;
    private Long parentId;
    private String comment;
}
