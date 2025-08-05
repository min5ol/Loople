package com.loople.backend.v2.domain.community.repository;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;
import com.loople.backend.v2.domain.community.entity.CommunityBoards;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityRepository extends JpaRepository<CommunityBoards, Long> {
    List<CommunityBoardsResponse> findByCategoryAndDongCodeStartingWithOrderByNoDesc(String category, String dongCodePrefix);
    CommunityBoardsResponse findByNo(Long no);
    List<CommunityBoardsResponse> findByCategoryStartingWithOrderByNoDesc(String category);
}
