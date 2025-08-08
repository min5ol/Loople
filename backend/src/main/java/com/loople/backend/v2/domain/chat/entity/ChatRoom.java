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

    @Column(name="post_id")
    private Long postId;

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

    @Column(name="a_left")
    private boolean ALeft;

    @Column(name="b_left")
    private boolean BLeft;


    @Builder
    public ChatRoom(Long postId, String participantA, String participantB, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.postId = postId;
        this.participantA = participantA;
        this.participantB = participantB;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
