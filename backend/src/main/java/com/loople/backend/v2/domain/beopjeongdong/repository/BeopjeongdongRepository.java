package com.loople.backend.v2.domain.beopjeongdong.repository;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BeopjeongdongRepository extends JpaRepository<Beopjeongdong, Long> {

    boolean existsByDongCode(String dongCode);

    Optional<Beopjeongdong> findByDongCode(String dongCode);

    @Query("""
        SELECT b FROM Beopjeongdong b
        WHERE b.sido = :sido
          AND b.sigungu = :sigungu
          AND b.eupmyun = :eupmyun
          AND (:ri IS NULL OR b.ri = :ri)
    """)
    Optional<Beopjeongdong> findByParts(
            @Param("sido") String sido,
            @Param("sigungu") String sigungu,
            @Param("eupmyun") String eupmyun,
            @Param("ri") String ri
    );
}
