package com.loople.backend.v2.domain.myRoom.entity;

import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_room")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyRoom
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @OneToOne(mappedBy = "room")
    private User user;

    @Column(nullable = false)
    private String roomName;

    @Column(nullable = false)
    private String backgroundColor;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate()
    {
        this.createdAt = LocalDateTime.now();
    }

    public void updateRoomName(String roomName)
    {
        this.roomName = roomName;
    }

    public void updateBackgroundColor(String backgroundColor)
    {
        this.backgroundColor = backgroundColor;
    }
}