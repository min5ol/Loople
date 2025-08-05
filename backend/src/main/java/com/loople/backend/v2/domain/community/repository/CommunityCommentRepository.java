package com.loople.backend.v2.domain.community.repository;

import com.loople.backend.v2.domain.community.entity.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {
    List<CommunityComment> findByBoardId(Long boardId);
    Optional<CommunityComment> findByNo(Long no);
}
