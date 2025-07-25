package com.loople.backend.v2.domain.myLoopling.entity;

import com.loople.backend.v2.domain.looplingCatalog.entity.LooplingCatalog;
import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "my_looplings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyLoopling
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loopling_catalog_no", nullable = false)
    private LooplingCatalog loopling;

    @Column(nullable = false)
    private boolean isEquipped;

    public void equip()
    {
        this.isEquipped = true;
    }

    public void unEquip()
    {
        this.isEquipped = false;
    }
}
