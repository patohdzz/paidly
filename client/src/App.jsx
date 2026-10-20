import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import ClientsPage from "./pages/ClientsPage";
import ServicesPage from "./pages/ServicesPage";
import BrowseServicesPage from "./pages/BrowseServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import BookServicePage from "./pages/BookServicePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import QuoteBuilderPage from "./pages/QuoteBuilderPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
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
        {/* Public pages: anyone can see these */}
        <Route index element={<HomePage />} />
        <Route path="services" element={<BrowseServicesPage />} />
        <Route path="services/:serviceId" element={<ServiceDetailsPage />} />

        {/* Customer-only pages */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="services/:serviceId/book" element={<BookServicePage />} />
          <Route path="my/bookings" element={<MyBookingsPage />} />
          <Route path="quote" element={<QuoteBuilderPage />} />
        </Route>

        {/* Admin-only pages */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="admin/services" element={<ServicesPage />} />
          <Route path="admin/bookings" element={<AdminBookingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;