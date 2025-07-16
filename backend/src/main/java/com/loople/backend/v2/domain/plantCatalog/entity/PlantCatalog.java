package com.loople.backend.v2.domain.plantCatalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plant_catalog")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PlantCatalog
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", nullable=false, columnDefinition="TEXT")
    private String imageUrl;
}
