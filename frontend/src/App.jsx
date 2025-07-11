import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import Header from "./components/templates/Header";
import Footer from "./components/templates/Footer";

function App()
{
  return(
    <Router>
      <Header />
      <Routes>
        {routes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;