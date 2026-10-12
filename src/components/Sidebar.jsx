import { NavLink } from "react-router-dom";
import { useData } from "../hooks/useData";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Invoices", to: "/invoices" },
  { label: "Clients", to: "/clients" },
  { label: "Services", to: "/services" },
];

function Sidebar() {
  const { dispatch } = useData();

  function handleReset() {
    const confirmed = window.confirm(
      "Reset all data to the demo data? Your changes will be lost."
    );
    if (confirmed) {
      dispatch({ type: "RESET" });
    }
  }

  return (
    <aside className="sidebar bg-dark text-white p-3 flex-shrink-0 d-flex flex-column">
      <div className="fs-4 fw-bold px-2 mb-4">Paidly</div>

      <nav>
        <ul className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => (
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

      <button
        type="button"
        className="btn btn-outline-light btn-sm mt-auto"
        onClick={handleReset}
      >
        Reset demo data
      </button>
    </aside>
  );
}

export default Sidebar;