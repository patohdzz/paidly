import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import DashboardPage from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import ClientsPage from "./pages/ClientsPage";
import ServicesPage from "./pages/ServicesPage";
import BrowseServicesPage from "./pages/BrowseServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="services" element={<BrowseServicesPage />} />
        <Route path="services/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="admin/services" element={<ServicesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;