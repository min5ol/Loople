package com.loople.backend.v2.domain.community.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="community_comment")
@Getter
@Setter
@NoArgsConstructor
public class CommunityComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;
    @Column(name="user_id")
    private Long userId;
    private String nickname;
    @Column(name="board_id")
    private Long boardId;
    @Column(name="parent_id")
    private Long parentId;
    @Column(columnDefinition = "TEXT")
    private String comment;
    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name="updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
    @Column(name="is_deleted")
    private int isDeleted;
    @Column(name="deleted_at")
    private LocalDateTime deletedAt;

    @Builder
    public CommunityComment(Long userId, String nickname, Long boardId, Long parentId, String comment) {
        this.userId = userId;
        this.nickname = nickname;
        this.boardId = boardId;
        this.parentId = parentId;
        this.comment = comment;
    }
}
