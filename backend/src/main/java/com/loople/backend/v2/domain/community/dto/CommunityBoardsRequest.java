package com.loople.backend.v2.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityBoardsRequest {
    private Long no;
    private Long userId;
    private String nickname;
    private String dongCode;
    private String title;
    private String content;
    private String category;
    private boolean isFileChanged;
    private String attachedFile;
}
