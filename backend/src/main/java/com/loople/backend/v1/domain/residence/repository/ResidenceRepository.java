package com.loople.backend.v1.domain.residence.repository;

import com.loople.backend.v1.domain.residence.entity.Residence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResidenceRepository extends JpaRepository<Residence, Long> {
    Optional<Residence> findByAddressAndRegionCode(String address, String regionCode);
}
