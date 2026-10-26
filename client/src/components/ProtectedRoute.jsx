import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "./LoadingState";

// Improves the experience only. Real security is enforced by the backend.
function ProtectedRoute({ allowedRoles }) {
  const { user, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) {
    return <LoadingState message="Checking your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/services" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;