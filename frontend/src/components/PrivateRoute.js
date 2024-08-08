import React from "react";
import { Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  return isUserAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
