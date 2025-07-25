package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.ChatText;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatTextRepository extends JpaRepository<ChatText, Long> {
}
