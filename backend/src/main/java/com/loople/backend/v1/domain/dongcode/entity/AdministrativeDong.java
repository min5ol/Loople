/**
 * 행정동 엔티티
 * 작성자: 장민솔
 * 작성일: 2025-07-10
 */
package com.loople.backend.v1.domain.dongcode.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 행정동 정보 테이블 매핑
 */
@Entity
@Table(name = "administrative_dong")
@Getter
@Setter
@NoArgsConstructor
public class AdministrativeDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    private String sido; // 시도

    private String sigungu; // 시군구

    private String eupmyun; // 읍면동

    @Column(name = "dong_code")
    private String dongCode; // 행정동 코드

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 생성일시

    /**
     * 생성자
     * @param sido - 시도
     * @param sigungu - 시군구
     * @param eupmyun - 읍면동
     * @param dongCode - 행정동 코드
     * @param createdAt - 생성일시
     */
    @Builder
    public AdministrativeDong(String sido, String sigungu, String eupmyun, String dongCode, LocalDateTime createdAt) {
        this.sido = sido;
        this.sigungu = sigungu;
        this.eupmyun = eupmyun;
        this.dongCode = dongCode;
        this.createdAt = createdAt;
    }
}
