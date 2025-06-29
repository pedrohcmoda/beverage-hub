import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Management from "./components/Management/Management";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DrinkProvider } from "./context/DrinkProvider";
import React, { useState, useEffect } from "react";
import { API_BASE } from "./apiBase";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, {
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
          <Route
            path="/management"
            element={
              <ProtectedRoute>
                <Management />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DrinkProvider>
    </BrowserRouter>
  );
}

export default App;
