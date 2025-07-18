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

import java.util.Optional;

public interface BeopjeongdongRepository extends JpaRepository<Beopjeongdong, Long> {

    // dongCode가 이미 존재하는지 여부 확인
    boolean existsByDongCode(String dongCode);

    // dongCode로 단건 조회
    Optional<Beopjeongdong> findByDongCode(String dongCode);

    /*
     * 주소 정보(sido, sigungu, eupmyun, ri)를 기반으로 동 정보 조회
     * - ri가 null일 경우: ri 조건은 무시됨 (상위 주소까지만 일치하는 데이터 검색)
     * - 실제 쿼리문:
     *   SELECT * FROM beopjeongdong
     *   WHERE sido = :sido
     *     AND sigungu = :sigungu
     *     AND eupmyun = :eupmyun
     *     AND (:ri IS NULL OR ri = :ri)
     */
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