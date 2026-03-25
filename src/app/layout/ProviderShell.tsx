import { Link, NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import { db } from "../../mock/db";

const primary = [
  ["Inicio", "/proveedor/home", true],
  ["Mi expediente", "/proveedor/expediente", false],
  ["Mis contratos", "/proveedor/operacion/contratos", false],
  ["Periodos REPSE", "/proveedor/operacion/periodos", false],
  ["Mis documentos", "/proveedor/documentos", false],
  ["Mi evaluación", "/proveedor/evaluacion", false],
  ["Facturación", "/proveedor/facturacion", false],
  ["Planes de mejora", "/proveedor/planes", false],
  ["Biblioteca", "/proveedor/biblioteca", false],
] as const;

export function ProviderShell() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  if (user && user.role !== "PA" && user.role !== "PU") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="wf-page flex min-h-screen flex-col">
      <header className="wf-header shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="wf-header-logo no-underline">
            <img src="/LogoProspectiva.png" alt="Prospectiva" style={{ height: "28px", width: "auto", display: "block", mixBlendMode: "multiply" }} />
          </Link>
          <span className="wf-header-title hidden sm:inline">Portal Proveedores — {db.demoConfig.empresaNombre}</span>
        </div>
        <div className="wf-header-user">
          <span>{user?.name}</span>
          <span className="wf-chip wf-chip-preregistered">{user?.role}</span>
          <span className="wf-avatar" aria-hidden />
          <button type="button" className="wf-link-muted border-0 bg-transparent text-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="wf-menu-bar shrink-0 flex flex-wrap gap-1 px-2 py-2" aria-label="Navegación proveedor">
        {primary.map(([label, to, end]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `wf-menu-item ${isActive ? "wf-menu-item-active" : ""}`} end={end}>
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="wf-main wf-main-provider min-w-0 flex-1 bg-[#f5f5f5]">
        <Outlet />
      </main>
    </div>
  );
}
