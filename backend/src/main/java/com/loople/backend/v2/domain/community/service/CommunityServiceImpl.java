package com.loople.backend.v2.domain.community.service;

import com.loople.backend.v2.domain.community.dto.*;
import com.loople.backend.v2.domain.community.entity.CommunityBoards;
import com.loople.backend.v2.domain.community.entity.CommunityComment;
import com.loople.backend.v2.domain.community.entity.CommunityReports;
import com.loople.backend.v2.domain.community.repository.CommunityBoardsRepository;
import com.loople.backend.v2.domain.community.repository.CommunityCommentRepository;
import com.loople.backend.v2.domain.community.repository.CommunityReportsRepository;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.global.exception.UnauthorizedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService{
    private final UserRepository userRepository;
    private final CommunityBoardsRepository communityBoardsRepository;
    private final CommunityCommentRepository communityCommentRepository;
    private final CommunityReportsRepository communityReportsRepository;

    @Override
    @Transactional
    public CommunityBoardsResponse addPost(CommunityBoardsRequest communityBoardsRequest, Long userId, String type) {
        if(type.equals("update")){
            CommunityBoards before = getBoardsByNo(communityBoardsRequest.getNo());

            if(!before.getTitle().equals(communityBoardsRequest.getTitle())) {
                before.setTitle(communityBoardsRequest.getTitle());
            }
            if(!before.getCategory().equals(communityBoardsRequest.getCategory())){
                before.setCategory(communityBoardsRequest.getCategory());
            }

            if(!before.getContent().equals(communityBoardsRequest.getContent())){
                before.setContent(communityBoardsRequest.getContent());
            }

            if(communityBoardsRequest.isFileChanged()){
                before.setAttachedFile(communityBoardsRequest.getAttachedFile());
            }

            CommunityBoards updated = getBoardsByNo(communityBoardsRequest.getNo());

            return getBuildBoards(updated);
        } else {
            User user = getUser(userId);

            CommunityBoards communityBoards = new CommunityBoards(userId, user.getNickname(), user.getBeopjeongdong().getDongCode(),
                    communityBoardsRequest.getTitle(), communityBoardsRequest.getContent(), communityBoardsRequest.getCategory(), communityBoardsRequest.getAttachedFile(), LocalDateTime.now());

            CommunityBoards save = communityBoardsRepository.save(communityBoards);

            return getBuildBoards(save);
        }
    }

    @Override
    public List<CommunityBoardsResponse> getPostsByCategory(CommunityBoardsRequest communityBoardsRequest, Long userId) {
        String category = communityBoardsRequest.getCategory();
        User user = getUser(userId);
        String dongCodePrefix = user.getBeopjeongdong().getDongCode().substring(0, 5);
        List<CommunityBoards> byCategory = null;

        if(category.equals("NOTICE")){ byCategory = communityBoardsRepository.findByCategoryStartingWithAndIsDeletedNotOrderByNoDesc(category, 1); }
        else if(category.equals("ALL")) { byCategory = communityBoardsRepository.findByCategoryAndIsDeletedNotOrderByNoDesc("FREE", 1); }
        else{ byCategory = communityBoardsRepository.findByCategoryAndDongCodeStartingWithAndIsDeletedNotOrderByNoDesc(category, dongCodePrefix, 1); }

        return byCategory.stream()
                .map(communityBoards -> getBuildBoards(communityBoards))
                .collect(Collectors.toList());
    }

    @Override
    public CommunityBoardsResponse getPost(Long no) {
        CommunityBoards communityBoards = getBoardsByNo(no);
        return getBuildBoards(communityBoards);
    }

    @Override
    public CommunityCommentResponse addComment(Long userId, CommunityCommentRequest communityCommentRequest) {
        User user = getUser(userId);
        CommunityComment communityComment = CommunityComment.builder()
                .userId(userId)
                .nickname(user.getNickname())
                .boardId(communityCommentRequest.getBoardId())
                .parentId(communityCommentRequest.getParentId())
                .comment(communityCommentRequest.getComment())
                .build();

        CommunityComment saved = communityCommentRepository.save(communityComment);
        CommunityComment updatedComment = getCommentByNo(saved.getNo());

        return getBuildComment(updatedComment);
    }

    @Override
    public List<CommunityCommentResponse> getComments(Long boardId) {
        return communityCommentRepository.findByBoardIdAndIsDeletedNot(boardId, 1).stream()
                .map(board -> getBuildComment(board))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommunityCommentResponse editComment(CommunityCommentRequest communityCommentRequest, Long userId) {
        CommunityComment byNo = getCommentByNo(communityCommentRequest.getNo());

        validateTargetOwner(byNo.getUserId(), userId);

        byNo.setComment(communityCommentRequest.getComment());
        CommunityComment updatedComment = getCommentByNo(byNo.getNo());

        return getBuildComment(updatedComment);

    }

    @Override
    public void submitReport(CommunityReportsRequest communityReportsRequest, Long userId) {
        CommunityReports build = CommunityReports.builder()
                .userId(userId)
                .target(communityReportsRequest.getTarget())
                .targetId(communityReportsRequest.getTargetId())
                .category(communityReportsRequest.getCategory())
                .reason(communityReportsRequest.getReason())
                .build();

        communityReportsRepository.save(build);
    }


    @Override
    @Transactional
    public void deleteContent(String target, Long targetId, Long userId) {
        if (target.equals("post")) {
            CommunityBoards boardsByNo = getBoardsByNo(targetId);
            validateTargetOwner(boardsByNo.getUserId(), userId);
            boardsByNo.setIsDeleted(1);
            boardsByNo.setDeletedAt(LocalDateTime.now());
        } else if (target.equals("comment")) {
            CommunityComment commentByNo = getCommentByNo(targetId);
            validateTargetOwner(commentByNo.getUserId(), userId);
            commentByNo.setIsDeleted(1);
            commentByNo.setDeletedAt(LocalDateTime.now());
        }
    }

    private static void validateTargetOwner(Long targetNo, Long userId) {
        if (!targetNo.equals(userId)) {
            throw new UnauthorizedException("해당 글 작성자만 수정할 수 있습니다.");
        }
    }

    private CommunityComment getCommentByNo(Long no) {
        return communityCommentRepository.findByNoAndIsDeletedNot(no, 1)
                .orElseThrow(() -> new NoSuchElementException("해당 댓글이 존재하지 않습니다."));
    }

    private CommunityBoards getBoardsByNo(Long no) {
        return communityBoardsRepository.findByNoAndIsDeletedNot(no, 1)
                .orElseThrow(() -> new NoSuchElementException("해당 게시물이 존재하지 않습니다."));
    }


    private static CommunityCommentResponse getBuildComment(CommunityComment entity) {
        return CommunityCommentResponse.builder()
                .no(entity.getNo())
                .userId(entity.getUserId())
                .nickname(entity.getNickname())
                .boardId(entity.getBoardId())
                .parentId(entity.getParentId())
                .comment(entity.getComment())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private static CommunityBoardsResponse getBuildBoards(CommunityBoards communityBoards) {
        return CommunityBoardsResponse.builder()
                .no(communityBoards.getNo())
                .userId(communityBoards.getUserId())
                .nickname(communityBoards.getNickname())
                .dongCode(communityBoards.getDongCode())
                .title(communityBoards.getTitle())
                .content(communityBoards.getContent())
                .category(communityBoards.getCategory())
                .attachedFile(communityBoards.getAttachedFile())
                .createdAt(communityBoards.getCreatedAt())
                .updatedAt(communityBoards.getUpdatedAt())
                .build();
    }

    private User getUser(Long userId) {
        return userRepository.findByNo(userId)
                .orElseThrow(() -> new NoSuchElementException("해당 아이디가 존재하지 않습니다."));
    }


}
