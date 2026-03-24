import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

const fases: { id: "A" | "B" | "C"; nombre: string; desc: string }[] = [
  { id: "A", nombre: "Potencial", desc: "Capacidad y cumplimiento base (demo mapeada a criterios A)." },
  { id: "B", nombre: "Funcionamiento actual", desc: "Calidad operativa e incidencias (criterios B)." },
  { id: "C", nombre: "Capacidad estratégica", desc: "Riesgo y apego a procesos (criterios C)." },
];

export function ProviderEvaluationDetailPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId ?? "";
  const latest = db.evaluations.find((e) => e.supplierId === sid);

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
        Tres fases de negocio (FR-40). En esta demo los criterios A/B/C del mock se muestran agrupados así.
      </p>

      <div className="space-y-4">
        {fases.map((f) => {
          const criterios = db.evaluationConfig.criteria[f.id];
          return (
            <div key={f.id} className="wf-card">
              <h2 className="mb-1 text-base font-bold">
                {f.nombre} <span className="text-xs font-normal">({f.id})</span>
              </h2>
              <p className="mb-3 text-xs" style={{ color: "var(--wf-text-muted)" }}>
                {f.desc}
              </p>
              <ul className="space-y-1 text-sm">
                {criterios.map((c) => {
                  const key = `${f.id}:${c}`;
                  const v = latest?.scores[key];
                  return (
                    <li key={key} className="flex justify-between gap-2 border-b border-[#eee] py-1">
                      <span>{c}</span>
                      <span className="font-mono text-xs">{v !== undefined ? `${v}/5` : "—"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/proveedor/home">
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
