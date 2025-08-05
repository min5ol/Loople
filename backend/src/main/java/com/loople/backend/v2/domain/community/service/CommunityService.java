package com.loople.backend.v2.domain.community.service;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsRequest;
import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;
import com.loople.backend.v2.domain.community.dto.CommunityCommentRequest;
import com.loople.backend.v2.domain.community.dto.CommunityCommentResponse;

import java.util.List;

public interface CommunityService {
    CommunityBoardsResponse savePost(CommunityBoardsRequest communityBoardsRequest);
    List<CommunityBoardsResponse> getPostsByCategory(CommunityBoardsRequest communityBoardsRequest, Long userId);
    CommunityBoardsResponse getPost(Long no);
    CommunityCommentResponse addComment(Long userId, CommunityCommentRequest communityCommentRequest);
    List<CommunityCommentResponse> getComments(Long boardId);
    CommunityCommentResponse editComment(CommunityCommentRequest communityCommentRequest);
}
