/*
    작성일자: 2025-07-18
    작성자: 백진선
    설명: 사용자 포인트 갱신을 위한 요청 데이터 전달용 DTO 클래스
*/
package com.loople.backend.v2.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdatedUserPointRequest {
    private Long userId;    //사용자 ID
    private int points; //갱신할 값
}
