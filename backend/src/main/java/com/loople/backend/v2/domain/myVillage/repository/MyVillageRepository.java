package com.loople.backend.v2.domain.myVillage.repository;

import com.loople.backend.v2.domain.myVillage.entity.MyVillage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MyVillageRepository extends JpaRepository<MyVillage, Long>
{
    Optional<MyVillage> findByDongCodePrefix(String prefix);
}
