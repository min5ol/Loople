import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/router";

function App()
{
  return(
    <Router>
      <Routes>
        {routes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;