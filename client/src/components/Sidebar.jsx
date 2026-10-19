import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import ConfirmDialog from "./ConfirmDialog";

const navItems = [
  { label: "Dashboard", to: "/", roles: ["admin"] },
  { label: "Browse Services", to: "/services", roles: ["guest", "customer", "admin"] },
  { label: "My Bookings", to: "/my/bookings", roles: ["customer"] },
  { label: "Invoices", to: "/invoices", roles: ["admin"] },
  { label: "Clients", to: "/clients", roles: ["admin"] },
  { label: "Manage Services", to: "/admin/services", roles: ["admin"] },
];

function Sidebar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { dispatch } = useData();
  const navigate = useNavigate();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const role = user?.role ?? "guest";
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  function handleReset() {
    dispatch({ type: "RESET" });
    setConfirmingReset(false);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar bg-dark text-white p-3 flex-shrink-0 d-flex flex-column">
      <div className="fs-4 fw-bold px-2 mb-4">Paidly</div>

      <nav>
        <ul className="nav nav-pills flex-column gap-1">
          {visibleItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "link-light"}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto d-flex flex-column gap-2">
        {isAdmin && (
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => setConfirmingReset(true)}
          >
            Reset demo data
          </button>
        )}

        {isLoggedIn ? (
          <div className="border-top border-secondary pt-3">
            <div className="px-2 mb-2">
              <div className="fw-semibold text-truncate">{user.name}</div>
              <div className="small text-white-50 text-capitalize">
                {user.role}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-light btn-sm w-100"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-light btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-sm">
              Sign up
            </Link>
          </>
        )}
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset demo data?"
          message="All clients, services, and invoices will be replaced with the demo data. Your changes will be lost."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setConfirmingReset(false)}
        />
      )}
    </aside>
  );
}

export default Sidebar;