import React from "react";
import { Navigate } from "react-router-dom";
import { isUserAuthenticated, getCurrentUser } from "../utils/auth";

const PublicRoute = ({ children }) => {
  if (isUserAuthenticated()) {
    const user = getCurrentUser();
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" />;
      case "formateur":
        return <Navigate to="/formateur" />;
      case "apprenant":
        return <Navigate to="/apprenant" />;
      default:
        return <Navigate to="/" />;
    }
  }
  return children;
};

export default PublicRoute;
