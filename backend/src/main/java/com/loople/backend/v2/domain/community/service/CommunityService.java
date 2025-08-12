package com.loople.backend.v2.domain.community.service;

import com.loople.backend.v2.domain.community.dto.*;

import java.util.List;

public interface CommunityService {
    CommunityBoardsResponse addPost(Long userId, CommunityBoardsRequest communityBoardsRequest, String type);
    List<CommunityBoardsResponse> getPostsByCategory(Long userId, CommunityBoardsRequest communityBoardsRequest);
    CommunityBoardsResponse getPost(Long no);
    CommunityCommentResponse addComment(Long userId, CommunityCommentRequest communityCommentRequest);
    List<CommunityCommentResponse> getComments(Long boardId);
    CommunityCommentResponse editComment(Long userId, CommunityCommentRequest communityCommentRequest);
    void submitReport(Long userId, CommunityReportsRequest communityReportsRequest);
    void deleteContent(String target, Long targetId, Long userId);
}
