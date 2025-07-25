// 작성자: 장민솔
// 설명: 다음 주소 검색 스크립트를 동적으로 로드하는 유틸 함수입니다.
// SPA 환경에서 중복 로딩을 방지하고 안정적으로 daum.Postcode 객체를 사용하기 위함입니다.

// src/utils/loadDaumPostcode.js

export const loadDaumPostcodeScript = () => {
  return new Promise((resolve, reject) => {
    if (window.daum?.Postcode) {
      resolve(); // 이미 로드된 경우
      return;
    }

    const existingScript = document.querySelector("script[src*='postcode.v2.js']");
    if (existingScript) {
      existingScript.addEventListener("load", resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};