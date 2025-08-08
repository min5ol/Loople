package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByParticipantAAndParticipantBAndPostId(String participantA, String participantB, Long postId);
    List<ChatRoom> findAllByParticipantAAndALeftFalse(String participantA);
    List<ChatRoom> findAllByParticipantBAndBLeftFalse(String participantB);
    Optional<ChatRoom> findByNo(Long no);
}
