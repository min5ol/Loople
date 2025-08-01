/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 법정동 엔티티(Beopjeongdong)에 대한 데이터베이스 접근을 담당하는 JPA Repository
 *       - dongCode로 조회/존재 여부 확인
 *       - 주소 4단계(sido, sigungu, eupmyun, ri)로 조회
 */

package com.loople.backend.v2.domain.beopjeongdong.repository;

import com.loople.backend.v2.domain.beopjeongdong.entity.Beopjeongdong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BeopjeongdongRepository extends JpaRepository<Beopjeongdong, Long>
{
    Optional<Beopjeongdong> findBySidoAndSigunguAndEupmyunAndRi(
            String sido, String sigungu, String eupmyun, String ri
    );
    boolean existsByDongCode(String dongCode);

    @Query("SELECT DISTINCT b.sido FROM Beopjeongdong b")
    List<String> findDistinctSido();

    @Query("SELECT DISTINCT b.sigungu FROM Beopjeongdong b WHERE b.sido = :sido")
    List<String> findDistinctSigunguBySido(@Param("sido") String sido);

    @Query("SELECT DISTINCT b.eupmyun FROM Beopjeongdong b WHERE b.sigungu = :sigungu")
    List<String> findDistinctEupmyunBySigungu(@Param("sigungu") String sigungu);

    @Query("SELECT DISTINCT b.ri FROM Beopjeongdong b WHERE b.eupmyun = :eupmyun")
    List<String> findDistinctRiByEupmyun(@Param("eupmyun") String eupmyun);
}