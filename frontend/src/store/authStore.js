// src/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: !!v }),

      setAuthInfo: ({ accessToken, refreshToken, user } = {}) =>
        set((prev) => {
          const mappedUser = user
            ? {
                id: user.id ?? user.userId ?? user.uid ?? null,
                email: user.email ?? null,
                nickname:
                  user.nickname ??
                  user.nickName ??
                  user.name ??
                  user.username ??
                  null,
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
      storage: createJSONStorage(() => localStorage),
      // 일부 환경에서 onRehydrateStorage가 불안정한 경우가 있어
      // persist.onFinishHydration 과 rehydrate()를 같이 써서 보강
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[authStore] rehydrate error:', error);
        }
        // rehydrate 직후에 hasHydrated 토글
        state?.setHasHydrated?.(true);
      },
      // 저장 필드 제한하고 싶으면 partialize 써도 됨
      // partialize: (s) => ({
      //   accessToken: s.accessToken,
      //   refreshToken: s.refreshToken,
      //   userInfo: s.userInfo,
      // }),
    }
  )
);

// HMR/특정 브라우저에서 rehydrate가 안붙는 경우를 대비한 보강
// (zustand v4에서 제공)
useAuthStore.persist?.onFinishHydration?.(() => {
  const setHasHydrated = useAuthStore.getState().setHasHydrated;
  setHasHydrated(true);
});
// 혹시 초기 구동 시 rehydrate가 안 붙었으면 직접 킥
useAuthStore.persist?.rehydrate?.();

// 셀렉터
export const selectAccessToken = (s) => s.accessToken;
export const selectRefreshToken = (s) => s.refreshToken;
export const selectUserInfo = (s) => s.userInfo;
export const selectNickname = (s) => s.userInfo?.nickname;
export const selectClearAuthInfo = (s) => s.clearAuthInfo;
export const selectSetAuthInfo = (s) => s.setAuthInfo;
export const selectHasHydrated = (s) => s.hasHydrated;
