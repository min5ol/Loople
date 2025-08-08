// 작성일: 2025.07.14
// 작성자: 장민솔, 백진선
// 설명: react-router-dom v6 이상에서 사용하는 라우트 설정 배열. 각 페이지 컴포넌트를 path에 매핑하여 라우팅 구성.

// src/routes/router.jsx

import Home from "../components/pages/Home"; // 로그인 페이지
import SignUpStep1 from "../components/pages/SignUpStep1"; // 회원가입 1단계: 이메일/비밀번호
import SignUpStep2 from "../components/pages/SignUpStep2"; // 회원가입 2단계: 이름/닉네임/전화번호
import SignUpStep3 from "../components/pages/SignUpStep3"; // 회원가입 3단계: 주소 + 프로필
import Quiz from "../components/pages/Quiz";     // 오늘의 퀴즈 페이지
import LoopleHomes from "../components/pages/LoopleHomes";  //웹 홈 페이지
import OAuthCallback from "../components/pages/OAuthCallback";
import SignUpComplete from "../components/pages/SignUpComplete";
import RegionalRules from "../components/pages/RegionalRules";
import NewPost from "../components/pages/NewPost";
import CommunityPost from "../components/pages/CommunityPost";
import ReportPage from "../components/pages/ReportPage";
import Chat from "../components/pages/Chat";
import MyPage from "../components/pages/myPage";

const routes = [
  { path: "/", element: <Home /> },               // 로그인 (루트)
  { path: "/signup", element: <SignUpStep1 /> },  // 회원가입 1단계
  { path: "/signup/step2", element: <SignUpStep2 /> },  // 회원가입 2단계
  { path: "/signup/step3", element: <SignUpStep3 /> },  // 회원가입 3단계
  { path: "/quiz", element: <Quiz /> },            // 퀴즈 메인
  { path: "/looplehome", element: <LoopleHomes />},
  { path: "/oauth/callback/:provider", element: <OAuthCallback />},
  { path: "/signup/complete", element: <SignUpComplete /> },
  { path: "/rule", element: <RegionalRules /> },
  { path: "/newPost", element: <NewPost/> },
  { path: "/communityPost", element: <CommunityPost/> },
  { path: "/reportPage", element: <ReportPage /> },
  { path: "/chat", element: <Chat /> },
  { path: "/mypage", element: <MyPage /> },
];

export default routes;
