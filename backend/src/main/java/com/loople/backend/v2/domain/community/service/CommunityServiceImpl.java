package com.loople.backend.v2.domain.community.service;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsRequest;
import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;
import com.loople.backend.v2.domain.community.entity.CommunityBoards;
import com.loople.backend.v2.domain.community.repository.CommunityRepository;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService{
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;

    @Override
    public CommunityBoardsResponse savePost(CommunityBoardsRequest communityBoardsRequest) {
        User user = getUser(communityBoardsRequest.getUserId());

        CommunityBoards communityBoards = new CommunityBoards(communityBoardsRequest.getUserId(), user.getNickname(), user.getBeopjeongdong().getDongCode(),
                communityBoardsRequest.getTitle(), communityBoardsRequest.getContent(), communityBoardsRequest.getCategory(), communityBoardsRequest.getAttachedFile(), LocalDateTime.now());

        CommunityBoards save = communityRepository.save(communityBoards);

        return new CommunityBoardsResponse(save.getNo(), save.getNickname(), save.getDongCode(), save.getTitle(), save.getContent(), save.getCategory(), save.getAttachedFile(), save.getCreatedAt());
    }

    @Override
    public List<CommunityBoardsResponse> getPostsByCategory(String category, Long userId) {
        User user = getUser(userId);
        String dongCodePrefix = user.getBeopjeongdong().getDongCode().substring(0, 5);
        System.out.println("dongCodePrefix = " + dongCodePrefix);
        if(category.equals("NOTICE")){
            System.out.println("notice");
            return communityRepository.findByCategoryStartingWithOrderByNoDesc(category);
        } else{
            System.out.println("free, used");
            return communityRepository.findByCategoryAndDongCodeStartingWithOrderByNoDesc(category, dongCodePrefix);
        }

    }

    @Override
    public CommunityBoardsResponse getPost(Long no) {
        return communityRepository.findByNo(no);
    }

    private User getUser(Long userId) {
        User user = userRepository.findByNo(userId)
                .orElseThrow(() -> new NoSuchElementException("해당 아이디가 존재하지 않습니다."));
        return user;
    }

}
