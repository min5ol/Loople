package com.loople.backend.v2.domain.myVillage.entity;

import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.villageStatus.entity.VillageStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "my_village")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MyVillage
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_status_no", nullable = false)
    private VillageStatus villageStatus;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private boolean isEquipped;
}
