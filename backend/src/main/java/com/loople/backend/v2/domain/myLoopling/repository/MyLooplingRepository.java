package com.loople.backend.v2.domain.myLoopling.repository;

import com.loople.backend.v2.domain.myLoopling.entity.MyLoopling;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyLooplingRepository extends JpaRepository<MyLoopling, Long>
{
    List<MyLoopling> findByUser_No(Long userNo);
    Optional<MyLoopling> findByUser_NoAndIsEquippedTrue(Long userNo);
}
