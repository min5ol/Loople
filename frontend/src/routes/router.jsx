import Home from "../components/pages/Home";
import SignUp from "../components/pages/SignUp";
import Quiz from "../components/pages/Quiz";
import Onboarding from "../components/pages/Onboarding";

const routes =
[
  { path : '/', element: <Home /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/quiz", element: <Quiz />},
  { path: '/onboarding', element: <Onboarding /> }
];

export default routes;