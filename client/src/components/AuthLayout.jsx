import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center px-3 py-5">
      <Link to="/services" className="fs-3 fw-bold text-dark text-decoration-none mb-4">
        Paidly
      </Link>

      <div className="card border-0 shadow-sm w-100 auth-card">
        <div className="card-body p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;