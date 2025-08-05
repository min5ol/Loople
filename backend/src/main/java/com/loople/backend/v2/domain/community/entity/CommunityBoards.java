package com.loople.backend.v2.domain.community.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="community_boards")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommunityBoards {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="user_id")
    private Long userId;

    private String nickname;

    @Column(name="dong_code")
    private String dongCode;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;

    @Column(name="attached_file", columnDefinition = "TEXT")
    private String attachedFile;

    @Column(name="created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name="updated_at", updatable = false, insertable = false)
    private LocalDateTime updatedAt;

    @Column(name="is_deleted")
    private Integer isDeleted;

    @Column(name="deleted_at", updatable = false, insertable = false)
    private LocalDateTime deletedAt;

    @Builder
    public CommunityBoards(Long userId, String nickname, String dongCode, String title, String content, String category, String attachedFile, LocalDateTime createdAt) {
        this.userId = userId;
        this.nickname = nickname;
        this.dongCode = dongCode;
        this.title = title;
        this.content = content;
        this.category = category;
        this.attachedFile = attachedFile;
        this.createdAt = createdAt;
    }

}