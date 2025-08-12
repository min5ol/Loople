// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      setAuthInfo: ({ accessToken, refreshToken, user } = {}) =>
        set((prev) => {
          const mappedUser = user
            ? {
                id: user.id ?? user.userId ?? user.uid,
                email: user.email,
                nickname:
                  user.nickname ??
                  user.nickName ??
                  user.name ??
                  user.username,
                avatarUrl: user.avatarUrl ?? user.profileImageUrl ?? null,
              }
            : prev.userInfo;

          return {
            accessToken: accessToken ?? prev.accessToken,
            refreshToken: refreshToken ?? prev.refreshToken,
            userInfo: mappedUser ?? null,
          };
        }),

      clearAuthInfo: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userInfo: null,
        }),
    }),
    {
      name: 'loople-auth',
      version: 1,
      onRehydrateStorage: () => (state) => {
        // 리하이드 완료 표시
        state?.setHasHydrated?.(true);
      },
    }
  )
);

// 편의 selector들
export const selectAccessToken = (s) => s.accessToken;
export const selectRefreshToken = (s) => s.refreshToken;
export const selectUserInfo = (s) => s.userInfo;
export const selectNickname = (s) => s.userInfo?.nickname;
export const selectClearAuthInfo = (s) => s.clearAuthInfo;
export const selectSetAuthInfo = (s) => s.setAuthInfo;
export const selectHasHydrated = (s) => s.hasHydrated;