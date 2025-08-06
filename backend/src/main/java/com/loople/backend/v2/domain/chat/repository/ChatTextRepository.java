package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.ChatText;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatTextRepository extends JpaRepository<ChatText, Long> {
    Optional<ChatText> findTopByRoomIdOrderByCreatedAtDesc(Long roomId);
    List<ChatText> findByRoomIdOrderByCreatedAtDesc(Long roomId);
}
