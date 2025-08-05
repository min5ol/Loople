package com.loople.backend.v2.domain.community.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="community_reports")
@Getter
@NoArgsConstructor
public class CommunityReports {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="user_id")
    private Long userId;

    @Column(name="board_id")
    private Long boardId;

    @Column(name="comment_id")
    private Long commentId;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public CommunityReports(Long userId, Long boardId, Long commentId, String category, String reason) {
        this.userId = userId;
        this.boardId = boardId;
        this.commentId = commentId;
        this.category = category;
        this.reason = reason;
    }
}
