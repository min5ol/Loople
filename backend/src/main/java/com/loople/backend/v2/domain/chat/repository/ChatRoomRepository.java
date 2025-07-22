package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByParticipantAAndParticipantB(String participantA, String participantB);
}
