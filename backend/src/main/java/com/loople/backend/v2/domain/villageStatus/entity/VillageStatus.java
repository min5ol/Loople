package com.loople.backend.v2.domain.villageStatus.entity;

import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
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

    @OneToOne
    @MapsId
    @JoinColumn(name = "no")
    private MyVillage village;

    @Column(nullable = false)
    private int population;

    @Column(nullable = false)
    private int totalPoints;
}
