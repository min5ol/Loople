package com.loople.backend.v2.domain.chat.repository;

import com.loople.backend.v2.domain.chat.entity.ChatbotCategoryDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatbotCategoryDetailRepository extends JpaRepository<ChatbotCategoryDetail, Long>{
    List<ChatbotCategoryDetail> findByCategoryId(Long parentId);
}
