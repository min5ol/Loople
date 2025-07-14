package com.loople.backend.v2.domain.aiChatbot.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="ai_chat_history")
@NoArgsConstructor
public class Chatbot {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name="user_id")
    private String userId;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_from_ai")
    private boolean isFromAi;   //AI의 요청 여부
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Builder
    public Chatbot(String userId, String content, boolean isFromAi) {
        this.userId = userId;
        this.content = content;
        this.isFromAi = isFromAi;
    }
}
