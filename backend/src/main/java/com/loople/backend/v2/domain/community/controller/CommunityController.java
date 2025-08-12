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

    @PostMapping("/post/submit/{type}")
    public CommunityBoardsResponse handlePostSubmit(@RequestBody CommunityBoardsRequest communityBoardsRequest,
                                                    @PathVariable String type){ //type=update, create
        return communityService.addPost(communityBoardsRequest, type);
    }

    @PostMapping("/posts")
    public List<CommunityBoardsResponse> getPostsByCategory(@RequestBody CommunityBoardsRequest communityBoardsRequest){
        return communityService.getPostsByCategory(communityBoardsRequest);
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
    public CommunityCommentResponse addComment(@RequestBody CommunityCommentRequest communityCommentRequest){
        return communityService.addComment(communityCommentRequest);
    }

    @PostMapping("/comment/edit")
    public CommunityCommentResponse editComment(@RequestBody CommunityCommentRequest communityCommentRequest){
        return communityService.editComment(communityCommentRequest);
    }

    @PostMapping("/reports")
    public void submitReport(@RequestBody CommunityReportsRequest communityReportsRequest){
        communityService.submitReport(communityReportsRequest);
    }

    @GetMapping("/delete")
    public void deleteContent(@RequestParam String target, @RequestParam Long targetId, @RequestParam Long userId){
        communityService.deleteContent(target, targetId, userId);
    }
}
