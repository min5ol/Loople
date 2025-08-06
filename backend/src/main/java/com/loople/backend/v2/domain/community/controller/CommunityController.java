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

    private final GetLoggedInUserId getLoggedInUserId;
    private final CommunityService communityService;

    @PostMapping("/post/submit/{type}")
    public CommunityBoardsResponse handlePostSubmit(@RequestBody CommunityBoardsRequest communityBoardsRequest, @PathVariable String type,
                           HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.addPost(communityBoardsRequest, userId, type);
    }

    @PostMapping("/posts")
    public List<CommunityBoardsResponse> getPostsByCategory(@RequestBody CommunityBoardsRequest communityBoardsRequest, HttpServletRequest request){
        System.out.println("category = " + communityBoardsRequest.getCategory());
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.getPostsByCategory(communityBoardsRequest, userId);
    }

    @GetMapping("/post/{no}")
    public CommunityBoardsResponse getPost(@PathVariable Long no){
        System.out.println("no = " + no);
        return communityService.getPost(no);
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
        return communityService.editComment(communityCommentRequest, userId);
    }

    @PostMapping("/reports")
    public void submitReport(@RequestBody CommunityReportsRequest communityReportsRequest, HttpServletRequest request){
        System.out.println("communityReports = " + communityReportsRequest);
        Long userId = getLoggedInUserId.getUserId(request);
        communityService.submitReport(communityReportsRequest, userId);
    }

    @GetMapping("/delete")
    public void deleteContent(@RequestParam String target, @RequestParam Long targetId, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        communityService.deleteContent(target, targetId, userId);
    }
}
