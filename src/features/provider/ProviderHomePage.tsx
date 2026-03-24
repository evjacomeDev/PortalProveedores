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
        <Link className="wf-btn wf-btn-primary inline-flex h-auto items-center justify-center px-8 py-3 text-[15px] no-underline" to="/proveedor/documentos">
          Ir a mis documentos
        </Link>
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
          <ul className="space-y-2 text-sm" style={{ color: "var(--wf-text-soft)" }}>
            {myPeriods.slice(0, 5).map((p) => (
              <li key={p.id}>
                {p.label} — vence {p.dueDate} ({p.status})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
