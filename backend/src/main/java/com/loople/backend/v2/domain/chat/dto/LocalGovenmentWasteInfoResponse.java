package com.loople.backend.v2.domain.chat.dto;


import lombok.Builder;
import lombok.Data;

@Data
public class LocalGovenmentWasteInfoResponse {
    private String sido;
    private String sigungu;

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

    @Builder(builderMethodName = "builderForUrl")
    public LocalGovenmentWasteInfoResponse(String sido, String sigungu, String homepage, String allInfoUrl, String generalUrl, String foodUrl, String recyclingUrl, String bulkyUrl, String wasteType, String disposalMethod) {
        this.sido = sido;
        this.sigungu = sigungu;
        this.homepage = homepage;
        this.allInfoUrl = allInfoUrl;
        this.generalUrl = generalUrl;
        this.foodUrl = foodUrl;
        this.recyclingUrl = recyclingUrl;
        this.bulkyUrl = bulkyUrl;
        this.wasteType = wasteType;
        this.disposalMethod = disposalMethod;
    }

    @Builder(builderMethodName = "builderForInfo")
    public LocalGovenmentWasteInfoResponse(String sido, String sigungu, String wasteType, String disposalTime, String disposalDays, String disposalLocation, String disposalMethod) {
        this.sido = sido;
        this.sigungu = sigungu;
        this.wasteType = wasteType;
        this.disposalTime = disposalTime;
        this.disposalDays = disposalDays;
        this.disposalLocation = disposalLocation;
        this.disposalMethod = disposalMethod;
    }
}