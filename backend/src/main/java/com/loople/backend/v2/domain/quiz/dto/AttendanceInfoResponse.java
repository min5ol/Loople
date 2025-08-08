package com.loople.backend.v2.domain.quiz.dto;

public record AttendanceInfoResponse(
        int consecutiveDays,
        int monthlyDays
) {}
