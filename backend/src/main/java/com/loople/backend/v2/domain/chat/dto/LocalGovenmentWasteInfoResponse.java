package com.loople.backend.v2.domain.chat.dto;


import lombok.Builder;
import lombok.Data;

@Data
public class LocalGovenmentWasteInfoResponse {
    private String homepage;
    private String allInfoUrl;
    private String generalUrl;
    private String foodUrl;
    private String recyclingUrl;
    private String bulkyUrl;


    private String wasteType;
    private String disposalTime;
    private String disposalDays;
    private String collectionSchedule;
    private String disposalLocation;
    private String disposalMethod;
    private String notes;

    private String imgUrl;

    @Builder
    public LocalGovenmentWasteInfoResponse(String homepage, String allInfoUrl, String generalUrl, String foodUrl, String recyclingUrl, String bulkyUrl, String disposalMethod) {
        this.homepage = homepage;
        this.allInfoUrl = allInfoUrl;
        this.generalUrl = generalUrl;
        this.foodUrl = foodUrl;
        this.recyclingUrl = recyclingUrl;
        this.bulkyUrl = bulkyUrl;
        this.disposalMethod = disposalMethod;
    }
}