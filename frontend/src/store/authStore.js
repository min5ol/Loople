// src/store/authStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      userInfo: {
        userId: null,
        nickname: null,
        email: null,
      },
      accessToken: null,

      setAuthInfo: (info) => set({
        userInfo: {
          userId: info.userId,
          nickname: info.nickname,
          email: info.email,
        },
        accessToken: info.token,
      }),

      clearAuthInfo: () => set({
        userInfo: { userId: null, nickname: null, email: null },
        accessToken: null,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);