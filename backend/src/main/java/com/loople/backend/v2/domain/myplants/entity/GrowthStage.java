/**
 * 작성일자: 2025-07-15
 * 작성자: 장민솔
 * 설명: 식물의 성장 단계를 나타내는 Enum 클래스
 *       - 유저가 보유한 식물의 상태를 구분하는 데 사용
 */

package com.loople.backend.v2.domain.myplants.entity;

public enum GrowthStage {

    SEED,     // 씨앗 단계: 식물 획득 직후 초기 상태
    SPROUT,   // 새싹 단계: 일정 조건 충족 후 성장 시작
    BLOOM,    // 개화 단계: 식물이 완전히 성장한 상태
    DEAD      // 죽음 단계: 방치 또는 조건 미달로 생장 실패
}