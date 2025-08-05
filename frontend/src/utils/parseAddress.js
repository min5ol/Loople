// 작성자: 장민솔
// 설명: 카카오 주소 API 응답에서 시/군/구, 읍/면/동, 리 정보를 파싱하여 동코드 조회에 필요한 행정구역 정보를 정제합니다.
// 사용처: 회원가입 시 입력된 주소로부터 dongCode를 조회하기 위한 주소 파싱 단계에서 사용됨

// src/utils/parseAddress.js

import { normalizeSido } from "./normalizeAddress";

export function parseAddress(address) {
  if (!address || typeof address !== "object") {
    throw new Error("올바른 주소 객체가 아님");
  }

  const rawSido = address.region_1depth_name?.trim() ?? "";
  const sigungu = address.region_2depth_name?.replace(/\s/g, "") ?? "";
  const region3 = address.region_3depth_name?.replace(/\s/g, "") ?? "";
  const region4 = address.region_4depth_name?.replace(/\s/g, "") ?? "";

  let eupmyun = region3;
  let ri = region4; // ← 핵심: region_4depth_name 활용

  // Kakao가 리 정보를 region4에 안 주는 경우만 fallback 처리
  if (!ri && region3.endsWith("리")) {
    const idx =
      region3.lastIndexOf("읍") >= 0
        ? region3.lastIndexOf("읍")
        : region3.lastIndexOf("면") >= 0
        ? region3.lastIndexOf("면")
        : region3.lastIndexOf("동");

    if (idx > 0) {
      eupmyun = region3.slice(0, idx + 1);
      ri = region3.slice(idx + 1);
    }
  }

  return {
    sido: normalizeSido(rawSido),
    sigungu,
    eupmyun,
    ri,
  };
}