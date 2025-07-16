/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 정보를 저장하는 엔티티
 */

package com.loople.backend.v2.domain.beopjeongdong.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "beopjeongdong")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Beopjeongdong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sido;
    private String sigungu;
    private String eupmyun;
    private String ri;

    @Column(name = "dong_code", unique = true)
    private String dongCode;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate()
    {
        this.createdAt = LocalDateTime.now();
    }
}
