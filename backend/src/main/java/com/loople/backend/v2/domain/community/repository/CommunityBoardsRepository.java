package com.loople.backend.v2.domain.community.repository;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;
import com.loople.backend.v2.domain.community.entity.CommunityBoards;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityBoardsRepository extends JpaRepository<CommunityBoards, Long> {
    List<CommunityBoards> findByCategoryAndDongCodeStartingWithOrderByNoDesc(String category, String dongCodePrefix);
    Optional<CommunityBoards> findByNo(Long no);
    List<CommunityBoards> findByCategoryStartingWithOrderByNoDesc(String category);
    List<CommunityBoards> findByCategoryNotOrderByNoDesc(String category);

}
