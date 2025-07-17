export default function getCroppedImg(imageSrc, pixelCrop, originalFile) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Blob 변환 실패");
          const file = new File([blob], originalFile.name, { type: originalFile.type });
          resolve(file);
        },
        originalFile.type || "image/jpeg",
        1
      );
    };
    image.onerror = (e) => reject(e);
  });
}