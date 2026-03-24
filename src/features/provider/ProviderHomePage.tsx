import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderHomePage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId;
  const myPeriods = db.periods.filter((p) => p.supplierId === sid);
  const pending = myPeriods.filter((p) => p.status !== "Aprobado").length;
  const dueSoon = myPeriods.filter((p) => p.status === "Abierto" || p.status === "En captura").length;
  const latestEval = db.evaluations
    .filter((e) => e.supplierId === sid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const activePlans = db.improvementPlans.filter((p) => p.supplierId === sid && p.status !== "Cerrado").length;

  return (
    <>
      <section className="mb-8">
        <h1 className="mb-3 text-2xl font-bold" style={{ color: "var(--wf-text)" }}>
          Bienvenido, {user?.name ?? "proveedor"}
        </h1>
        <p className="mb-6 max-w-3xl text-[15px] leading-relaxed" style={{ color: "var(--wf-text-muted)" }}>
          Centro de tareas: pendientes documentales, evaluación, planes de mejora y enlaces operativos (demo navegable).
        </p>

        {pending > 0 || activePlans > 0 ? (
          <div className="wf-card mb-6 border-l-4 border-[#e63946] bg-[#fff5f5]">
            <h2 className="mb-2 font-bold text-[#e63946]">¡Atención requerida!</h2>
            <p className="mb-4 text-sm" style={{ color: "var(--wf-text-soft)" }}>
              Tienes {pending} documentos pendientes o rechazados y {activePlans} planes de mejora activos que requieren tu acción inmediata para mantener tu cumplimiento.
            </p>
            <div className="flex flex-wrap gap-3">
              {pending > 0 && (
                <Link className="wf-btn wf-btn-primary inline-flex items-center justify-center no-underline" to="/proveedor/documentos">
                  Subir documentos pendientes
                </Link>
              )}
              {activePlans > 0 && (
                <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline border-[#e63946] text-[#e63946]" to="/proveedor/planes">
                  Ver planes de mejora
                </Link>
              )}
            </div>
          </div>
        ) : (
          <Link className="wf-btn wf-btn-primary inline-flex h-auto items-center justify-center px-8 py-3 text-[15px] no-underline" to="/proveedor/documentos">
            Ir a mis documentos
          </Link>
        )}
      </section>

      <div className="wf-kpi-row">
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-blue" />
          <div className="wf-kpi-title">Documentos / periodos pendientes</div>
          <div className="wf-kpi-value">{pending}</div>
        </div>
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-orange" />
          <div className="wf-kpi-title">Por vencer</div>
          <div className="wf-kpi-value">{dueSoon}</div>
        </div>
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-green" />
          <div className="wf-kpi-title">Score actual</div>
          <div className="wf-kpi-value text-lg">{latestEval ? latestEval.finalScore.toFixed(1) : "—"}</div>
        </div>
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-red" />
          <div className="wf-kpi-title">Planes de mejora</div>
          <div className="wf-kpi-value">{activePlans}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="wf-card">
          <h2 className="mb-3 text-sm font-bold">Accesos rápidos</h2>
          <div className="flex flex-col gap-2">
            <Link className="wf-link-muted text-sm" to="/proveedor/expediente">
              Mi expediente
            </Link>
            <Link className="wf-link-muted text-sm" to="/proveedor/evaluacion">
              Mi evaluación
            </Link>
            <Link className="wf-link-muted text-sm" to="/proveedor/planes">
              Planes de mejora
            </Link>
            <Link className="wf-link-muted text-sm" to="/proveedor/biblioteca">
              Biblioteca PDF
            </Link>
            <Link className="wf-link-muted text-sm" to="/proveedor/facturacion">
              Facturación
            </Link>
            <Link className="wf-link-muted text-sm" to="/proveedor/operacion/contratos">
              Operación — contratos
            </Link>
            <Link className="wf-link-muted text-sm" to="/proveedor/operacion/periodos">
              Operación — periodos
            </Link>
          </div>
        </div>
        <div className="wf-card">
          <h2 className="mb-3 text-sm font-bold">Próximos vencimientos (demo)</h2>
          <ul className="space-y-4 text-sm" style={{ color: "var(--wf-text-soft)" }}>
            {myPeriods.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 border-[#eaeaea]">
                <div>
                  <span className="font-semibold" style={{ color: "var(--wf-text)" }}>{p.label}</span> — vence {p.dueDate}
                  <div className="mt-1"><span className="wf-chip wf-chip-validating text-xs">{p.status}</span></div>
                </div>
                <Link className="wf-btn wf-btn-secondary text-xs px-3 py-1 no-underline shrink-0" to="/proveedor/documentos">
                  Cargar
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
