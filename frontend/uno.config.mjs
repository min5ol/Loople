// uno.config.mjs
import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  presets: [presetUno()],
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
      'primary': '#3C9A5F',
      'primary-light':' #81C784',
      'secondary':'#749E89',
      'surface-dark': '#264D3D',
      'accent':'#FEF7E2',
      'w-ground': '#F6F6F6',
      'b-ground':'#202020',
    },
    boxSizing: {
      DEFAULT: 'border-box',
    }
  },
  transformCSS: 'pre',
})