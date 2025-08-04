package com.loople.backend.v2.domain.community.service;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsRequest;
import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;

import java.util.List;

public interface CommunityService {
    CommunityBoardsResponse savePost(CommunityBoardsRequest communityBoardsRequest);
    List<CommunityBoardsResponse> getPostsByCategory(String category, Long userId);
    CommunityBoardsResponse getPost(Long no);
}
