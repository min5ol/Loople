package com.loople.backend.v2.domain.myVillage.entity;

import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = false, unique = true, length = 8)
    private String dongCodePrefix;

    @OneToMany(mappedBy = "village")
    private List<User> users = new ArrayList<>();
}
