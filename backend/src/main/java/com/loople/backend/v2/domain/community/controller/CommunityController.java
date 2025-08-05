package com.loople.backend.v2.domain.community.controller;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsRequest;
import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;
import com.loople.backend.v2.domain.community.dto.CommunityCommentRequest;
import com.loople.backend.v2.domain.community.dto.CommunityCommentResponse;
import com.loople.backend.v2.domain.community.service.CommunityService;
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

    @PostMapping("/create")
    public CommunityBoardsResponse createPost(@RequestPart("title") String title,
                           @RequestPart("category") String category,
                           @RequestPart("content") String content,
                           @RequestPart(value="attachedFile", required=false) String attachedFile,
                           HttpServletRequest request){
        String presignedUrl;
        if(attachedFile != null && !attachedFile.isEmpty()){
            presignedUrl = attachedFile;
        } else{
            presignedUrl = null;
        }

        Long userId = getLoggedInUserId.getUserId(request);

        CommunityBoardsRequest communityBoardsRequest = new CommunityBoardsRequest(
                userId, null, null, title, content, category, presignedUrl);
        return communityService.savePost(communityBoardsRequest);
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

    @PostMapping("/comment")
    public CommunityCommentResponse addComment(@RequestBody CommunityCommentRequest communityCommentRequest, HttpServletRequest request){
        Long userId = getLoggedInUserId.getUserId(request);
        return communityService.addComment(userId, communityCommentRequest);
    }

    @PostMapping("/comment/edit")
    public CommunityCommentResponse editComment(@RequestBody CommunityCommentRequest communityCommentRequest){
        System.out.println("communityCommentRequest = " + communityCommentRequest);
        return communityService.editComment(communityCommentRequest);
    }


}
