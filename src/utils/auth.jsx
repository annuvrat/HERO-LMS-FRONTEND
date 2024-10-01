// utils/auth.js
import { default as jwtDecode } from "jwt-decode";

export const getUserDesignation = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.designation; // Assuming 'designation' is stored in the token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isAuthorized = (allowedRoles) => {
  const designation = getUserDesignation();
  return allowedRoles.includes(designation);
};
