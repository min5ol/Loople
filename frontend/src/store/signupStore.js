import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 회원가입 플로우 전용 스토어 (세션 스토리지에만 보존)
export const useSignupStore = create(
  persist(
    (set, get) => ({
      // OAuth 콜백에서 받은 기본 정보
      socialData: { provider: null, email: null, socialId: null },

      // SignUpStep2에서 입력하는 추가 정보 (닉네임/전화/약관 등)
      step2Data: {},

      // 저장 액션들
      setSocialData: (payload) =>
        set({ socialData: { ...get().socialData, ...payload } }),

      setStep2Data: (payload) =>
        set({ step2Data: { ...get().step2Data, ...payload } }),

      // ✅ 과거 코드 호환(혹시 setStepTwoData로 부르는 곳이 있다면 대비)
      setStepTwoData: (payload) =>
        set({ step2Data: { ...get().step2Data, ...payload } }),

      clearSignup: () =>
        set({
          socialData: { provider: null, email: null, socialId: null },
          step2Data: {},
        }),
    }),
    {
      name: 'signup-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ socialData: s.socialData, step2Data: s.step2Data }),
    }
  )
);

// 선택자(권장: 단일 필드/함수만 가져오기)
export const selectSetStep2Data = (s) => s.setStep2Data;
export const selectSetSocialData = (s) => s.setSocialData;
export const selectSocialData = (s) => s.socialData;
export const selectStep2Data = (s) => s.step2Data;
