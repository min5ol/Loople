// Axios 인스턴스: 스토어의 accessToken을 자동으로 Authorization 헤더에 실어줍니다.
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const instance = axios.create({
  baseURL: "/api/v2", // Vite proxy로 8080으로 전달됨
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 첨부
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState()?.accessToken;
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터(선택): 401 로깅
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("[axios] 401 Unauthorized 응답 수신");
      // 필요 시: useAuthStore.getState().logout(); 등 추가 처리
    }
    return Promise.reject(error);
  }
);

export default instance;
