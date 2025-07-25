package com.loople.backend.v2.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(name="participant_a")
    private String participantA;

    @Column(name="participant_b")
    private String participantB;

    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name="is_deleted")
    private int isDeleted;

    @Column(name="deleted_at", insertable = false, updatable = false)
    private LocalDateTime deletedAt;

    @Builder
    public ChatRoom(String participantA, String participantB, int isDeleted) {
        this.participantA = participantA;
        this.participantB = participantB;
        this.isDeleted = isDeleted;
    }
}
