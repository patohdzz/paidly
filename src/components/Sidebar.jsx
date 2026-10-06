import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Invoices", to: "/invoices" },
  { label: "Clients", to: "/clients" },
  { label: "Services", to: "/services" },
];

function Sidebar() {
  return (
    <aside className="sidebar bg-dark text-white p-3 flex-shrink-0">
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
    </aside>
  );
}

export default Sidebar;