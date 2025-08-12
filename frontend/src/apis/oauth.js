import instance from "./instance";

/**
 * 소셜 로그인 (인가코드 교환)
 * 주의: 백엔드 OAuthServiceImpl 쪽 클라이언트 선택은 보통 'google' | 'kakao' 등 **소문자**를 기대합니다.
 * 그래서 여기서 provider를 소문자로 변환해서 보냅니다.
 */
export async function socialLogin(provider, code) {
  const res = await instance.post("/oauth/login", {
    provider: String(provider).toLowerCase(),
    code,
  });
  return res.data; // { token?, isNew, email, socialId, provider ... }
}
