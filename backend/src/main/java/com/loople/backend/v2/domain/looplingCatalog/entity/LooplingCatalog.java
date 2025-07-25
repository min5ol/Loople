package com.loople.backend.v2.domain.looplingCatalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loopling_catalog")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LooplingCatalog
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String description;
}
