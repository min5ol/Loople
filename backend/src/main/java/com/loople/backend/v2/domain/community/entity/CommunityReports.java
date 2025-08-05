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

    private String target;

    @Column(name="target_id")
    private Long targetId;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public CommunityReports(Long userId, String target, Long targetId, String category, String reason) {
        this.userId = userId;
        this.target = target;
        this.targetId = targetId;
        this.category = category;
        this.reason = reason;
    }
}
