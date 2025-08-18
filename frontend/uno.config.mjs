// uno.config.mjs
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],

  // 전역 초기화
  preflights: [
    {
      getCSS: () => `
        *,*::before,*::after {
          box-sizing: border-box;
          border: none; /* 모든 요소 기본 border 제거 */
        }
        :root {
          color-scheme: light;
        }
        input, button, textarea, select {
          border: none; /* 폼 요소 기본 테두리 제거 */
          outline: none; /* 포커스 아웃라인 제거 (ring으로 대체) */
        }
      `,
    },
  ],

  shortcuts: [
    // 공통 컨트롤
    ['ctl-base', 'w-full h-12 px-4 rounded-lg shadow-inner focus:outline-none focus:ring-4 transition box-border'],
    ['ctl-input', 'ctl-base bg-white placeholder-black/40 ring-brand-300'],
    ['ctl-btn-primary', 'ctl-base bg-brand-500 text-white font-ptd-600 shadow-lg hover:bg-brand-600 disabled:opacity-60 ring-brand-300'],
    ['ctl-btn-social', 'ctl-base shadow-md hover:opacity-90 ring-brand-300 flex items-center justify-center gap-3'],
  ],

  rules: [
    ['font-ptd-100', { 'font-family': 'pretendard', 'font-weight': '100' }],
    ['font-ptd-200', { 'font-family': 'pretendard', 'font-weight': '200' }],
    ['font-ptd-300', { 'font-family': 'pretendard', 'font-weight': '300' }],
    ['font-ptd-400', { 'font-family': 'pretendard', 'font-weight': '400' }],
    ['font-ptd-500', { 'font-family': 'pretendard', 'font-weight': '500' }],
    ['font-ptd-600', { 'font-family': 'pretendard', 'font-weight': '600' }],
    ['font-ptd-700', { 'font-family': 'pretendard', 'font-weight': '700' }],
    ['font-ptd-800', { 'font-family': 'pretendard', 'font-weight': '800' }],
    ['font-ptd-900', { 'font-family': 'pretendard', 'font-weight': '900' }],
  ],

  theme: {
    colors: {
      brand: {
        50:  '#F6F6F6',
        100: '#FEF7E2',
        300: '#CFE7D8',
        500: '#7FCF9A',
        600: '#3C9A5F',
        ink: '#202020',
      },
    },
  },

  safelist: [
    'bg-brand-50','bg-brand-100','bg-brand-300','bg-brand-500','bg-brand-600',
    'text-brand-ink','focus:ring-brand-300','shadow-inner','backdrop-blur-md',
  ],
})
