import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";

function HomePage() {
  const { isAdmin, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <LoadingState />;
  }

  return <Navigate to={isAdmin ? "/admin/bookings" : "/services"} replace />;
}

export default HomePage;