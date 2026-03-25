import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import type { Role } from "../../mock/types";
import { useAuthStore } from "../../features/auth/store";
import { getRoleLabel } from "../roleMapping";
import { db } from "../../mock/db";

type NavKey =
  | "dashboard"
  | "proveedores"
  | "validacion"
  | "evaluacion"
  | "ranking"
  | "planes"
  | "reportes"
  | "config"
  | "usuarios"
  | "biblioteca";

function showInternalNav(role: Role | undefined, key: NavKey): boolean {
  if (!role || role === "PA" || role === "PU") return false;
  switch (key) {
    case "dashboard":
    case "proveedores":
      return true;
    case "validacion":
    case "evaluacion":
    case "ranking":
    case "planes":
      return role !== "CS";
    case "reportes":
    case "config":
      return role === "AG" || role === "CO" || role === "FI";
    case "usuarios":
    case "biblioteca":
      return role === "AG";
    default:
      return false;
  }
}

const navDef: { key: NavKey; label: string; to: string; end?: boolean }[] = [
  { key: "dashboard", label: "Dashboard", to: "/app/dashboard", end: true },
  { key: "proveedores", label: "Proveedores", to: "/app/proveedores" },
  { key: "validacion", label: "Validación", to: "/app/validacion" },
  { key: "evaluacion", label: "Evaluación", to: "/app/evaluacion" },
  { key: "ranking", label: "Ranking", to: "/app/ranking" },
  { key: "planes", label: "Planes de mejora", to: "/app/planes-mejora" },
  { key: "reportes", label: "Reportes", to: "/app/reportes" },
  { key: "config", label: "Config. documental", to: "/app/config/documentos" },
  { key: "usuarios", label: "Usuarios", to: "/app/admin/usuarios" },
  { key: "biblioteca", label: "Biblioteca (admin)", to: "/app/admin/biblioteca" },
];

export function AppShell() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (user?.role === "PA" || user?.role === "PU") {
    return <Navigate to="/proveedor/home" replace />;
  }

  const items = navDef.filter((n) => showInternalNav(user?.role, n.key));

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
          <span className="hidden text-sm md:inline">{location.pathname}</span>
          <span className="wf-chip wf-chip-validating">{user?.role}</span>
          <span>{user?.name}</span>
          <span className="wf-avatar" aria-hidden />
          <Link className="wf-link-muted text-sm" to="/app/dashboard">
            Inicio
          </Link>
          <button type="button" className="wf-btn wf-btn-primary text-sm" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="wf-sidebar shrink-0">
          <div className="p-3 border-b" style={{ borderColor: "var(--wf-border)" }}>
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <span className="wf-chip wf-chip-validating text-xs mt-1 inline-block">
              {getRoleLabel(user?.role as Role)}
            </span>
            {user && (user as any).areas?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {(user as any).areas.map((area: string) => (
                  <span key={area} className="text-xs px-1 py-0.5 rounded"
                    style={{ background: "var(--wf-bg-muted)", color: "var(--wf-text-muted)", fontSize: "10px" }}>
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
          <nav className="wf-sidebar-nav">
            {items.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => `wf-sidebar-item ${isActive ? "wf-sidebar-item-active" : ""}`}
                end={n.end}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="wf-main min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
