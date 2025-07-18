/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 정보를 저장하는 JPA 엔티티 클래스
 *       - 시도, 시군구, 읍면, 리 정보와 dongCode를 보유
 *       - DB 테이블 'beopjeongdong'과 매핑됨
 */

package com.loople.backend.v2.domain.beopjeongdong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity // JPA 엔티티임을 명시
@Table(name = "beopjeongdong") // 매핑될 테이블 이름 설정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 보호
@AllArgsConstructor
@Builder
public class Beopjeongdong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 자동 증가 전략
    private Long id; // 엔티티 식별자

    private String sido;     // 시/도 (예: 경상남도)
    private String sigungu;  // 시/군/구 (예: 창원시 마산회원구)
    private String eupmyun;  // 읍/면/동 (예: 내서읍)
    private String ri;       // 리 (예: 삼계리)

    @Column(name = "dong_code", unique = true) // 법정동 코드, 유일해야 함
    private String dongCode;

    @Column(name = "created_at", nullable = false) // 생성 시각, null 불가
    private LocalDateTime createdAt = LocalDateTime.now(); // 기본값 현재 시각

    @PrePersist
    protected void onCreate() {
        // persist 전 생성일시 자동 저장
        this.createdAt = LocalDateTime.now();
    }
}