import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("syncSpaceUser"));
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
