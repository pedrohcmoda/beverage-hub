import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, publicRoute = false }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null;
  
  if (publicRoute) {
    if (isAuthenticated) return <Navigate to="/" replace />;
    return children;
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
