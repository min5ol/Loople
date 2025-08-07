package com.loople.backend.v2.domain.chat.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name="local_government_waste_info")
@Getter
public class LocalGovernmentWasteInfo {
    @Id
    private Long no;

    private String sido;
    private String sigungu;

    @Column(columnDefinition = "TEXT")
    private String homepage;

    @Column(name="all_info_url", columnDefinition = "TEXT")
    private String allInfoUrl;

    @Column(name="general_url", columnDefinition = "TEXT")
    private String generalUrl;

    @Column(name="food_url", columnDefinition = "TEXT")
    private String foodUrl;

    @Column(name="recycling_url", columnDefinition = "TEXT")
    private String recyclingUrl;

    @Column(name="bulky_url", columnDefinition = "TEXT")
    private String bulkyUrl;

    @Column(name="waste_type")
    private String wasteType;

    @Column(name="disposal_time")
    private String disposalTime;

    @Column(name="disposal_days", columnDefinition = "TEXT")
    private String disposalDays;

    @Column(name="collection_schedule", columnDefinition = "TEXT")
    private String collectionSchedule;

    @Column(name="disposal_location")
    private String disposalLocation;

    @Column(name="disposal_method", columnDefinition = "TEXT")
    private String disposalMethod;

    private String notes;

    @Column(name="img_url")
    private String imgUrl;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    @Column(name="created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    @Column(name="updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
