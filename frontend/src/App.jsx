import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DrinkProvider } from "./context/DrinkProvider";
import React, { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <BrowserRouter>
      <DrinkProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register onRegister={setUser} />}
          />
        </Routes>
      </DrinkProvider>
    </BrowserRouter>
  );
}

export default App;
