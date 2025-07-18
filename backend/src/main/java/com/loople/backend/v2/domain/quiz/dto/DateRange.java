/*
    작성일자: 2025-07-18
    작성자: 백진선

 */
package com.loople.backend.v2.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DateRange {
    private LocalDate start;
    private LocalDate end;
}
