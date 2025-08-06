package com.loople.backend.v2.domain.community.repository;

import com.loople.backend.v2.domain.community.dto.CommunityBoardsResponse;
import com.loople.backend.v2.domain.community.entity.CommunityBoards;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityBoardsRepository extends JpaRepository<CommunityBoards, Long> {
    List<CommunityBoards> findByCategoryAndDongCodeStartingWithAndIsDeletedNotOrderByNoDesc(String category, String dongCodePrefix, int isDeleted);
    Optional<CommunityBoards> findByNoAndIsDeletedNot(Long no, int isDeleted);
    List<CommunityBoards> findByCategoryStartingWithAndIsDeletedNotOrderByNoDesc(String category, int isDeleted);
    List<CommunityBoards> findByCategoryNotAndIsDeletedNotOrderByNoDesc(String category, int isDeleted);

}
