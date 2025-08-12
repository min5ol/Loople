package com.loople.backend.v2.domain.community.service;

import com.loople.backend.v2.domain.community.dto.*;

import java.util.List;

public interface CommunityService {
    CommunityBoardsResponse addPost(CommunityBoardsRequest communityBoardsRequest, String type);
    List<CommunityBoardsResponse> getPostsByCategory(CommunityBoardsRequest communityBoardsRequest);
    CommunityBoardsResponse getPost(Long no);
    CommunityCommentResponse addComment(CommunityCommentRequest communityCommentRequest);
    List<CommunityCommentResponse> getComments(Long boardId);
    CommunityCommentResponse editComment(CommunityCommentRequest communityCommentRequest);
    void submitReport(CommunityReportsRequest communityReportsRequest);
    void deleteContent(String target, Long targetId, Long userId);
}
