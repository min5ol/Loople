package com.loople.backend.v2.domain.chat.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="participant_a")
    private String participantA;

    @Column(name="participant_b")
    private String participantB;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    @Column(name="created_at")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name="is_deleted")
    private int isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    @Column(name="deleted_at")
    private LocalDateTime deletedAt;

    @Builder
    public ChatRoom(String participantA, String participantB, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.participantA = participantA;
        this.participantB = participantB;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
