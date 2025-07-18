import Home from "../components/pages/Home";
import SignUpStep1 from "../components/pages/SignUpStep1";
import SignUpStep2 from "../components/pages/SignUpStep2";
import SignUpStep3 from "../components/pages/SignUpStep3";
import TodayQuiz from "../components/pages/TodayQuiz";
import Onboarding from "../components/pages/Onboarding";
import Information from "../components/pages/Information";
import Test from "../components/pages/Test";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/signup", element: <SignUpStep1 /> },
  { path: "/signup/step2", element: <SignUpStep2 /> },
  { path: "/signup/step3", element: <SignUpStep3 /> },
  { path: "/information", element: <Information /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/quiz", element: <TodayQuiz /> },
  {path:"/test", element: <Test /> },
];

export default routes;