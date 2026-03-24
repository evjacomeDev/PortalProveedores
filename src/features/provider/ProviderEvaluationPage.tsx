import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

function semaforo(score: number) {
  if (score >= 80) return { label: "Favorable", className: "wf-chip wf-chip-active" };
  if (score >= 60) return { label: "Atención", className: "wf-chip wf-chip-validating" };
  return { label: "Crítico", className: "wf-chip wf-chip-blocked" };
}

export function ProviderEvaluationPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId ?? "";
  const latest = db.evaluations
    .filter((e) => e.supplierId === sid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const sm = latest ? semaforo(latest.finalScore) : null;

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Mi evaluación</strong>
      </div>
      <h1 className="wf-page-title">Mi evaluación de desempeño</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Score consolidado 0–100 y semáforo (FR-43, FR-44). Histórico y detalle por fases en la siguiente vista.
      </p>

      {latest ? (
        <div className="wf-card mb-6 max-w-xl">
          <div className="mb-2 text-sm" style={{ color: "var(--wf-text-muted)" }}>
            Evaluación más reciente
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="text-4xl font-bold">{latest.finalScore.toFixed(1)}</div>
            <span className={sm?.className}>{sm?.label}</span>
          </div>
          <p className="mt-2 text-sm">Categoría: {latest.category}</p>
        </div>
      ) : (
        <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Aún no hay evaluación registrada en la demo.
        </p>
      )}

      <Link className="wf-btn wf-btn-primary no-underline" to="/proveedor/evaluacion/detalle">
        Ver detalle por fases
      </Link>
    </>
  );
}
