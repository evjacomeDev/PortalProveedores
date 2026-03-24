import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const steps = [
  { path: "/registro/datos", label: "Datos generales", n: 1 },
  { path: "/registro/clasificacion", label: "Clasificación", n: 2 },
  { path: "/registro/cuestionario", label: "Cuestionario", n: 3 },
  { path: "/registro/documentos", label: "Documentos", n: 4 },
  { path: "/registro/confirmacion", label: "Confirmación", n: 5 },
] as const;

export function RegistrationLayout() {
  const location = useLocation();
  const current = steps.find((s) => location.pathname.startsWith(s.path)) ?? steps[0];

  return (
    <div className="wf-page min-h-screen flex flex-col bg-[#f5f5f5]">
      <header className="border-b border-[#ddd] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: "var(--wf-text-muted)" }}>
              Registro de proveedor potencial
            </div>
            <div className="text-sm font-bold" style={{ color: "var(--wf-text)" }}>
              Paso {current.n} de 5 — {current.label}
            </div>
          </div>
          <Link className="wf-link-muted text-sm no-underline" to="/">
            Volver al inicio
          </Link>
        </div>
        <nav className="mx-auto mt-4 flex max-w-3xl flex-wrap gap-2" aria-label="Progreso del registro">
          {steps.map((s) => (
            <NavLink
              key={s.path}
              to={s.path}
              className={({ isActive }) =>
                `rounded px-2 py-1 text-xs no-underline ${isActive ? "bg-[#333] text-white" : "bg-[#eee] text-[#555]"}`
              }
            >
              {s.n}. {s.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
