package com.loople.backend.v2.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="chat_text")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatText {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="room_id")
    private Long roomId;

    @Column(name="nickname")
    private String nickname;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String type;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public ChatText(Long roomId, String nickname, String content, String type, LocalDateTime createdAt) {
        this.roomId = roomId;
        this.nickname = nickname;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
    }
}
