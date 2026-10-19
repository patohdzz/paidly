import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="layout-main flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;