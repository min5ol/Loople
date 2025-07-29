package com.loople.backend.v2.domain.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name="chatbot_category")
@Getter
public class ChatbotCategory {
    @Id
    private Long no;

    @Column(columnDefinition = "TEXT")
    private String name;

    @Column(name="type")
    private String categoryType;

    @Column(name="parent_id")
    private Long parentId;
}
