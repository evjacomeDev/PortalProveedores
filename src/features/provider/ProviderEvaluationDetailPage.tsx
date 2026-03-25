import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderEvaluationDetailPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId ?? "";
  const latest = db.evaluations
    .filter((e) => e.supplierId === sid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const cfg = db.evaluationConfig;
  const fases = (["A", "B", "C"] as const).map((id) => ({
    id,
    nombre: cfg.phaseLabels[id],
    criteria: cfg.criteria[id],
  }));

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/evaluacion">
          Mi evaluación
        </Link>{" "}
        / <strong>Detalle</strong>
      </div>
      <h1 className="wf-page-title">Detalle por fases</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Tres fases de negocio (FR-40). Criterios A/B/C del config agrupados por fase.
      </p>

      <div className="space-y-4">
        {fases.map((f) => (
          <div key={f.id} className="wf-card">
            <h2 className="mb-3 text-base font-bold">
              Fase {f.id}: {f.nombre}
            </h2>
            <ul className="space-y-1 text-sm">
              {f.criteria.map((c) => {
                const key = `${f.id}:${c}`;
                const v = latest?.scores[key];
                const pct = v !== undefined ? ((v / 5) * 100).toFixed(0) : null;
                return (
                  <li key={key} className="flex justify-between gap-2 border-b border-[#eee] py-1">
                    <span>{c}</span>
                    <span className="font-mono text-xs">
                      {v !== undefined ? `${v}/5 (${pct}%)` : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/proveedor/home">
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
