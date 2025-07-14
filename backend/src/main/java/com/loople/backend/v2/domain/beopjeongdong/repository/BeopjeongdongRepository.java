package com.loople.backend.v2.domain.beopjeongdong.repository;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeopjeongdongRepository extends JpaRepository<Beopjeongdong, Long>
{
    boolean existsByDongCode(String dongCode);
}
