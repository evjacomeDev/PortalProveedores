import { Outlet } from "react-router-dom";

/** Las pantallas de auth usan el layout tipo wireframe (login_proveedor / card centrada). */
export function AuthShell() {
  return <Outlet />;
}
