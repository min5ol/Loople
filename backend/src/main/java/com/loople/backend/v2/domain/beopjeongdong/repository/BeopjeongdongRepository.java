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

import java.util.Optional;

public interface BeopjeongdongRepository extends JpaRepository<Beopjeongdong, Long>
{
    Optional<Beopjeongdong> findBySidoAndSigunguAndEupmyunAndRi(
            String sido, String sigungu, String eupmyun, String ri
    );
    boolean existsByDongCode(String dongCode);

    Optional<Beopjeongdong> findByDongCode(String dongCode);
}