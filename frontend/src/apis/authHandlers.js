// 예: src/apis/authHandlers.js
import instance from "../apis/instance";
import { useAuthStore } from "../store/authStore";

export async function handleAuthSuccess(apiPath, body) {
  const res = await instance.post(apiPath, body);
  const { accessToken, refreshToken, user } = res.data; // 키 이름은 백엔드에 맞게
  useAuthStore.getState().setAuthInfo({ accessToken, refreshToken, user });
}
