import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Protected route component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/" replace />
  }
  
  // Check if admin access is required
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return children;
}

export default ProtectedRoute;
