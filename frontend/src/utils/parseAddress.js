import { normalizeSido } from "./normalizeAddress";

export function parseAddress(address) {
  if (!address || typeof address !== "object") {
    throw new Error("올바른 주소 객체가 아님");
  }

  const rawSido = address.region_1depth_name?.trim() ?? "";
  const sigungu = address.region_2depth_name?.replace(/\s/g, "") ?? "";
  const eupmyunRi = address.region_3depth_name?.replace(/\s/g, "") ?? "";

  let eupmyun = eupmyunRi;
  let ri = "";

  if (eupmyunRi.endsWith("리")) {
    const idx =
      eupmyunRi.lastIndexOf("읍") >= 0
        ? eupmyunRi.lastIndexOf("읍")
        : eupmyunRi.lastIndexOf("면") >= 0
        ? eupmyunRi.lastIndexOf("면")
        : eupmyunRi.lastIndexOf("동");

    if (idx > 0) {
      eupmyun = eupmyunRi.slice(0, idx + 1);
      ri = eupmyunRi.slice(idx + 1);
    }
  }

  return {
    sido: normalizeSido(rawSido),
    sigungu,
    eupmyun,
    ri,
  };
}
