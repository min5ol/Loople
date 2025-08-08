package com.loople.backend.v2.domain.chat.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="chat_text")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatText {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    //CHAT, JOIN, LEAVE
    @Enumerated(EnumType.STRING)
    private MessageType type;

    @Column(name="room_id")
    private Long roomId;

    @Column(name="nickname")
    private String nickname;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name="a_visible")
    private boolean visibleA;

    @Column(name="b_visible")
    private boolean visibleB;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    @Column(name="created_at")
    private LocalDateTime createdAt;

    private int isDeleted;

    @Builder
    public ChatText(Long roomId, String nickname, String content, MessageType type, LocalDateTime createdAt, boolean visibleA, boolean visibleB) {
        this.roomId = roomId;
        this.nickname = nickname;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.visibleA = visibleA;
        this.visibleB = visibleB;
    }
}
