package com.loople.backend.v2.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityBoardsRequest {
    private Long userId;
    private String nickname;
    private String dongCode;
    private String title;
    private String content;
    private String category;
    private String attachedFile;

    @Builder
    public CommunityBoardsRequest(String title, String content, String category, String attachedFile) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.attachedFile = attachedFile;
    }
}
