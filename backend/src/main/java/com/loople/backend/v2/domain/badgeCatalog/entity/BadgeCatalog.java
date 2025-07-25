package com.loople.backend.v2.domain.badgeCatalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "badge_catalog")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BadgeCatalog
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false, unique = true)
    private String badgeName;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private int pointRequirement;
}
