package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.ChatbotCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatbotCategoryRepository extends JpaRepository<ChatbotCategory, Long> {
    List<ChatbotCategory> findByCategoryTypeAndParentId(String categoryType, Long ParentId);

}
