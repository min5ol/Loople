package com.loople.backend.v2.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CommunityBoardsResponse {
    private Long no;
    private Long userId;
    private String nickname;
    private String dongCode;
    private String title;
    private String content;
    private String category;
    private String attachedFile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommunityCommentResponse> comments;
}
