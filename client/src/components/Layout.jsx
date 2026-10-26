import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="d-md-flex min-vh-100">
      {/* Top bar: only on phones (hidden from md and up) */}
      <header className="d-md-none bg-dark text-white px-3 py-2 d-flex align-items-center justify-content-between sticky-top">
        <Link to="/" className="fs-5 fw-bold text-white text-decoration-none">
          <i className="bi bi-house-gear-fill text-primary me-2" aria-hidden="true" />
          Paidly
        </Link>
        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          &#9776; Menu
        </button>
      </header>

      <Sidebar isOpen={menuOpen} onClose={closeMenu} />

      {/* Dark background behind the open menu on phones; tap it to close */}
      {menuOpen && (
        <div className="sidebar-backdrop d-md-none" onClick={closeMenu} aria-hidden="true" />
      )}

      <main className="layout-main flex-grow-1 p-3 p-md-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;