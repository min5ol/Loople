// src/store/signupStore.js

import { create } from 'zustand';

// 스토어의 초기 상태
const initialState = {
  // 각 단계별 데이터를 구분하여 저장
  step1Data: {
    email: '',
    password: '',
  },
  step2Data: {
    name: '',
    nickname: '',
    phone: '',
  },
  // 소셜 로그인 시 임시 저장할 데이터
  socialData: {
    provider: '',
    socialId: '',
    email: '',
  },
};

// 스토어 생성
export const useSignupStore = create((set) => ({
  ...initialState,

  setStep1Data: (data) => set({ step1Data: data }),
  setStep2Data: (data) => set({ step2Data: data }),
  setSocialData: (data) => set({ socialData: data }),

  reset: () => set(initialState),
}));