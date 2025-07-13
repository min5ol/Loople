package com.loople.backend.v1.domain.dongcode.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "administrative_dong")
@Getter
@Setter
@NoArgsConstructor
public class AdministrativeDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sido;

    private String sigungu;

    private String eupmyun;

    @Column(name = "ri_name")
    private String riName;

    @Column(name = "dong_code")
    private String dongCode;

    @Column(name = "order_priority")
    private Integer order;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "gps_lat")
    private Double gpsLat;

    @Column(name = "gps_lng")
    private Double gpsLng;

    public String getRegionCode() {
        return this.dongCode;
    }

    @Builder
    public AdministrativeDong(String sido, String sigungu, String eupmyun, String riName, String dongCode, Integer order, LocalDateTime createdAt) {
        this.sido = sido;
        this.sigungu = sigungu;
        this.eupmyun = eupmyun;
        this.riName = riName;
        this.dongCode = dongCode;
        this.order = order;
        this.createdAt = createdAt;
    }

    public String getAddress() {
        StringBuilder sb = new StringBuilder();
        sb.append(sido);
        sb.append(" ").append(sigungu);
        sb.append(" ").append(eupmyun);
        if (riName != null && !riName.trim().isEmpty()) {
            sb.append(" ").append(riName);
        }
        return sb.toString().trim();
    }
}
