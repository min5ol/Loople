package com.loople.backend.v2.domain.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name="chatbot_category_detail")
@Getter
public class ChatbotCategoryDetail {
    @Id
    private Long no;

    @Column(name="category_id")
    private Long categoryId;

    @Column(name="info_type")
    private String infoType;

    @Column(columnDefinition = "TEXT")
    private String content;
}
