import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Management from "./components/Management/Management";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DrinkProvider } from "./context/DrinkProvider";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DrinkProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<ProtectedRoute publicRoute={true}><Login /></ProtectedRoute>} />
            <Route path="/register" element={<ProtectedRoute publicRoute={true}><Register /></ProtectedRoute>} />
            <Route path="/management" element={<ProtectedRoute><Management /></ProtectedRoute>} />
          </Routes>
        </DrinkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
