import { Navigate } from "react-router-dom";

// A wrapper for protected routes
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Or use a global auth state
  return isAuthenticated ? element : <Navigate to="/dash" />;
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
