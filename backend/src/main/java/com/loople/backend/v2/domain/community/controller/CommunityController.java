package com.loople.backend.v2.domain.community.controller;

import com.loople.backend.v2.domain.community.dto.*;
import com.loople.backend.v2.domain.community.entity.CommunityReports;
import com.loople.backend.v2.domain.community.service.CommunityService;
import com.loople.backend.v2.domain.users.service.UserService;
import com.loople.backend.v2.global.getUserId.GetLoggedInUserId;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;
    private final GetLoggedInUserId getLoggedInUserId;

    @PostMapping("/post/submit/{type}")
    public CommunityBoardsResponse handlePostSubmit(@RequestBody CommunityBoardsRequest communityBoardsRequest,
                                                    @PathVariable String type,
                                                    HttpServletRequest request){ //type=update, create
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.addPost(userId, communityBoardsRequest, type);
    }

    @PostMapping("/posts")
    public List<CommunityBoardsResponse> getPostsByCategory(@RequestBody CommunityBoardsRequest communityBoardsRequest, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.getPostsByCategory(userId, communityBoardsRequest);
    }

    @GetMapping("/post/{no}")
    public CommunityBoardsResponse getPost(@PathVariable Long no){
        CommunityBoardsResponse post = communityService.getPost(no);
        List<CommunityCommentResponse> comments = communityService.getComments(no);
        post.setComments(comments);
        return post;
    }

    @GetMapping("/{boardId}/comment")
    public List<CommunityCommentResponse> getComments(@PathVariable Long boardId){
        return communityService.getComments(boardId);
    }

    @PostMapping("/comment/add")
    public CommunityCommentResponse addComment(@RequestBody CommunityCommentRequest communityCommentRequest, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.addComment(userId, communityCommentRequest);
    }

    @PostMapping("/comment/edit")
    public CommunityCommentResponse editComment(@RequestBody CommunityCommentRequest communityCommentRequest, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.editComment(userId, communityCommentRequest);
    }

    @PostMapping("/reports")
    public void submitReport(@RequestBody CommunityReportsRequest communityReportsRequest, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        communityService.submitReport(userId, communityReportsRequest);
    }

    @GetMapping("/delete")
    public void deleteContent(@RequestParam String target, @RequestParam Long targetId, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        communityService.deleteContent(target, targetId, userId);
    }
}
