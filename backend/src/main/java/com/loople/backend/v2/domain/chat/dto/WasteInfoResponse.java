package com.loople.backend.v2.domain.chat.dto;

import lombok.Data;

@Data
public class WasteInfoResponse {
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
}
