// 작성자: 장민솔
// 설명: 카카오 주소 API 응답에서 시/군/구, 읍/면/동, 리 정보를 파싱하여 동코드 조회에 필요한 행정구역 정보를 정제합니다.
// 사용처: 회원가입 시 입력된 주소로부터 dongCode를 조회하기 위한 주소 파싱 단계에서 사용됨

// src/utils/parseAddress.js

import { normalizeSido } from "./normalizeAddress";

export function parseAddress(address) {
  if (!address || typeof address !== "object") {
    throw new Error("올바른 주소 객체가 아님");
  }

  // 시/도: "서울", "경기" 등 → 정규화 필요
  const rawSido = address.region_1depth_name?.trim() ?? "";

  // 시/군/구: "성남시 분당구" → 공백 제거 후 사용
  const sigungu = address.region_2depth_name?.replace(/\s/g, "") ?? "";

  // 읍/면/동 + 리 가 합쳐져 있는 값 (예: "내서읍삼계리")
  const eupmyunRi = address.region_3depth_name?.replace(/\s/g, "") ?? "";

  let eupmyun = eupmyunRi;
  let ri = "";

  // 예외 처리: "리"로 끝나면 "읍/면/동"과 "리"를 구분함
  if (eupmyunRi.endsWith("리")) {
    const idx =
      eupmyunRi.lastIndexOf("읍") >= 0
        ? eupmyunRi.lastIndexOf("읍")
        : eupmyunRi.lastIndexOf("면") >= 0
        ? eupmyunRi.lastIndexOf("면")
        : eupmyunRi.lastIndexOf("동");

    if (idx > 0) {
      eupmyun = eupmyunRi.slice(0, idx + 1); // 읍/면/동까지 추출
      ri = eupmyunRi.slice(idx + 1);         // 이후 문자열은 '리'
    }
  }

  return {
    sido: normalizeSido(rawSido), // 약칭 시도명 → 전체 행정명으로 변환
    sigungu,
    eupmyun,
    ri,
  };
}