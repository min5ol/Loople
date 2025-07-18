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