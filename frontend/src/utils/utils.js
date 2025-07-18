// 작성자: 장민솔
// 설명: 주어진 이미지 URL을 기반으로 HTMLImageElement 객체를 비동기 생성합니다.
// 사용처: react-easy-crop에서 자른 이미지 영역을 canvas에 그리기 위해, 이미지 원본을 메모리 상에 로드할 때 사용됨

export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // 이미지 로딩 완료 시 resolve
    img.addEventListener("load", () => resolve(img));

    // 이미지 로딩 실패 시 reject
    img.addEventListener("error", reject);

    // crossOrigin 속성을 설정하여 CORS 이슈 방지 (S3 등 외부 이미지 지원)
    img.setAttribute("crossOrigin", "anonymous");

    // 이미지 소스 설정 → 로딩 시작
    img.src = url;
  });
}