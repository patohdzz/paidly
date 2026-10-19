import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DashboardPage from "./DashboardPage";

function HomePage() {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <DashboardPage />;
  }

  return <Navigate to="/services" replace />;
}

export default HomePage;