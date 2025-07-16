import Home from "../components/pages/Home";
import SignUp from "../components/pages/SignUp";
import Quiz from "../components/pages/Quiz";

const routes =
[
  { path : '/', element: <Home /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/quiz", element: <Quiz />}
];

export default routes;