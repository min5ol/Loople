package com.loople.backend.v2.domain.villageStatus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "village_status")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class VillageStatus
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false, unique = true, length = 8)
    private String dongCodePrefix;

    @Column(nullable = false)
    private int population;

    @Column(nullable = false)
    private int totalPoints;
}
