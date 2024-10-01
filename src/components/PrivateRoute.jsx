// components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthorized } from "../utils/auth";

const PrivateRoute = ({ element, allowedRoles }) => {
  if (!isAuthorized(allowedRoles)) {
    // If the user is not authorized, redirect to login or another page
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
