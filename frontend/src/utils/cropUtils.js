export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // CORS 문제 방지
    image.src = url;
  });
}

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}
