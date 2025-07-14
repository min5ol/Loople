package com.loople.backend.v2.domain.beopjeongdong.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "beopjeongdong", uniqueConstraints = {
        @UniqueConstraint(name = "dong_code", columnNames = "dong_code")
})
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

    @Column(name = "dong_code", nullable = false, unique = true)
    private String dongCode;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
