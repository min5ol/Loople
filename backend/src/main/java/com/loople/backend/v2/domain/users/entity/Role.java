/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 사용자 권한을 나타내는 Enum 클래스
 *       - 일반 사용자 또는 관리자 여부를 구분하는 데 사용
 */

package com.loople.backend.v2.domain.users.entity;

public enum Role {

    USER,  // 일반 사용자 권한
    ADMIN  // 관리자 권한 (예: 전체 데이터 접근, 통계 관리 등)
}
