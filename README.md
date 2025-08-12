# Loople 🌿

## 📌 프로젝트 개요

- 프로젝트명: 루플(Loople)
- 프로젝트 기간: 2025.07.09 ~ 2025.08.12
- 프로젝트 소개

  순환과 사람 그리고 즐거움이 결합된 지속 가능한 순환의 삶을 돕는 플랫폼

  
  퀴즈, 아바타 키우기 등의 재미있는 활동을 통해 지역과 사람을 잇고, 모두가 함께 순환의 가치를 만들어가는 공간입니다.


---

## 주요 기능
### 회원가입 및 로그인(소셜로그인)
### 퀴즈
### 게시판
### 챗봇
### 채팅
### 알림
### 지역별 규칙
### 마을
### 아바타 및 개인 아이템

---

## 프로젝트 구조
### FE
~~~plaintext
FRONTEND/
├── node_modules/
├── public/
├── src/
│   ├── apis/
│   ├── assets/
│   ├── components/
│   │   ├── atoms/
│   │   ├── common/
│   │   ├── modals/
│   │   ├── organisms/
│   │   ├── pages/
│   │   └── templates/
│   ├── constants/
│   ├── context/
│   ├── hooks/ 
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── uno.config.mjs
├── vite.config.js
└── yarn.lock
~~~
- `src/apis` : API 요청 관련 모듈
- `src/assets` : 이미지, 폰트 등 정적 자원
- `src/components` : UI 컴포넌트 모음 (atoms, modals, templates 등으로 분리)
- `src/constants` : 상수 정의 파일
- `src/context` : 전역 상태 관리를 위한 React Context
- `src/hooks` : 커스텀 훅 정의
- `src/routes` : 라우팅 관련 설정 파일
- `src/services` : 도메인별 서비스 로직
- `src/store` : 전역 상태관리 (예: Redux, Zustand 등)
- `src/styles` : 전역 스타일, 테마 등 스타일 정의
- `src/utils` : 공통 유틸리티 함수
- `src/App.jsx` : 전체 앱을 구성하는 루트 컴포넌트
- `src/main.jsx` : 앱 진입점, React 앱을 DOM에 마운트
- `index.html` : 앱의 HTML 템플릿
- `vite.config.js` : Vite 번들러 설정 파일
- `.env` : 환경변수 설정 파일
- `package.json` : 프로젝트 의존성과 스크립트 정의


### BE
~~~plaintext
backend/
├── .gradle/
├── .idea/
├── build/
├── gradle/
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com/loople/backend/
│ │ │ ├── v1/
│ │ │ └── v2/
│ │ │ ├── domain/
│ │ │ │ ├── auth/
│ │ │ │ ├── avatarItem/
│ │ │ │ ├── badgeCatalog/
│ │ │ │ ├── beopjeongdong/
│ │ │ │ ├── chat/
│ │ │ │ ├── community/
│ │ │ │ ├── loopingCatalog/
│ │ │ │ ├── myAvatar/
│ │ │ │ ├── myAvatarItem/
│ │ │ │ ├── myBadge/
│ │ │ │ ├── myLoopling/
│ │ │ │ ├── myRoom/
│ │ │ │ ├── myRoomItem/
│ │ │ │ ├── myVillage/
│ │ │ │ ├── quiz/
│ │ │ │ ├── regionalRule/
│ │ │ │ ├── roomItem/
│ │ │ │ ├── userNotification/
│ │ │ │ ├── users/
│ │ │ │ └── villageStatus/
│ │ │ └── global/
│ │ │ ├── api/
│ │ │ ├── config/
│ │ │ ├── exception/
│ │ │ ├── getUserId/
│ │ │ ├── jwt/
│ │ │ └── s3/
│ │ └── resources/
│ │ └── application.yml
│ └── test/
├── .gitattributes
├── .gitignore
├── build.gradle
├── gradlew
├── gradlew.bat
├── HELP.md
└── settings.gradle
~~~

- `src/main/java/com/loople/backend/v2/domain` : 도메인별 세부 모듈들 (auth, chat, community 등)
- `src/main/java/com/loople/backend/v2/global` : 공통 기능 (api, config, exception 등)
- `src/main/resources/application.yml` : 설정 파일
- `build.gradle`, `gradlew` 등 : Gradle 빌드 관련 파일

---

## 기술 스택
### FE
### BE
### DB
### DEPLOY

---

## 팀원
|  이름  |  역할  | 
|--------|--------|
| 백진선 | FE, BE |
| 장민솔 | FE, BE |
