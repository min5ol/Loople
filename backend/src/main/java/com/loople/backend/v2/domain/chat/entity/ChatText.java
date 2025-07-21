package com.loople.backend.v2.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="chat_text")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatText {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="room_id")
    private Long roomId;

    @Column(name="user_email")
    private String userEmail;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public ChatText(Long roomId, String userEmail, String content) {
        this.roomId = roomId;
        this.userEmail = userEmail;
        this.content = content;
    }
}
