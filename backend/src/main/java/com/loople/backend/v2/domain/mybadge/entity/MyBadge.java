/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 유저가 획득한 배지를 저장하는 엔티티 클래스
 *       - N:1 관계로 User와 연결
 *       - 배지 이름 및 획득 일시 정보 포함
 */

package com.loople.backend.v2.domain.mybadge.entity;

import com.loople.backend.v2.domain.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_badges") // 테이블 이름 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자
@AllArgsConstructor
@Builder
public class MyBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 PK
    private Long no; // 배지 고유 식별자

    @ManyToOne(fetch = FetchType.LAZY) // User와 N:1 연관관계 (지연 로딩)
    @JoinColumn(name = "user_id") // 외래키 컬럼 이름 지정
    private User user; // 배지를 가진 유저

    private String badgeName; // 배지 이름

    @Column(name = "acquired_at") // 획득 시간 컬럼 명시
    private LocalDateTime acquiredAt; // 배지 획득 일시
}