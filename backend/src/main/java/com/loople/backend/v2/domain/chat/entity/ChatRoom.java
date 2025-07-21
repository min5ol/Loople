package com.loople.backend.v2.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    private String host;
    private String client;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name="is_deleted")
    private int isDeleted;

    @Column(name="deleted_at", insertable = false, updatable = false)
    private LocalDateTime deletedAt;

    @Builder
    public ChatRoom(String host, String client, int isDeleted) {
        this.host = host;
        this.client = client;
        this.isDeleted = isDeleted;
    }
}
