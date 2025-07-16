package com.loople.backend.v2.domain.myplants.entity;

import com.loople.backend.v2.domain.plantCatalog.entity.PlantCatalog;
import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_plants")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyPlant
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private boolean isSelected;

    @Column(name = "acquired_at")
    private LocalDateTime acquiredAt;

    @Enumerated(EnumType.STRING)
    private GrowthStage growthStage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id")
    private PlantCatalog plant;
}
