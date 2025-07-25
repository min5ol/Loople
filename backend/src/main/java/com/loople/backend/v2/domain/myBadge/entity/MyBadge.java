package com.loople.backend.v2.domain.myBadge.entity;

import com.loople.backend.v2.domain.badgeCatalog.entity.BadgeCatalog;
import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_badges")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyBadge
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_catalog_no", nullable = false)
    private BadgeCatalog badgeCatalog;

    @Column(nullable = false)
    private boolean isEquipped;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate()
    {
        this.createdAt = LocalDateTime.now();
    }

    public void equip()
    {
        this.isEquipped = true;
    }

    public void unEquip()
    {
        this.isEquipped = false;
    }
}