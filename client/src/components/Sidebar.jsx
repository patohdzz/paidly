import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Browse Services", to: "/services", roles: ["guest", "customer", "admin"] },
  { label: "AI Quote", to: "/quote", roles: ["guest", "customer"] },
  { label: "My Bookings", to: "/my/bookings", roles: ["customer"] },
  { label: "Bookings", to: "/admin/bookings", roles: ["admin"] },
  { label: "Manage Services", to: "/admin/services", roles: ["admin"] },
];

function Sidebar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role ?? "guest";
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar bg-dark text-white p-3 flex-shrink-0 d-flex flex-column">
      <Link to="/" className="fs-4 fw-bold px-2 mb-4 text-white text-decoration-none">
        Paidly
      </Link>

      <nav>
        <ul className="nav nav-pills flex-column gap-1">
          {visibleItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
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
        {isLoggedIn ? (
          <div className="border-top border-secondary pt-3">
            <div className="px-2 mb-2">
              <div className="fw-semibold text-truncate">{user.name}</div>
              <div className="small text-white-50 text-capitalize">{user.role}</div>
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
    </aside>
  );
}

export default Sidebar;