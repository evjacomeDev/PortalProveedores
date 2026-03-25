import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";
import type { EvaluationCategory } from "../../mock/types";

function categoryChip(cat: EvaluationCategory) {
  if (cat === "EXCELENTE" || cat === "CONFIABLE") return "wf-chip-active";
  if (cat === "REGULAR") return "wf-chip-validating";
  if (cat === "EN DESARROLLO") return "wf-chip-preregistered";
  return "wf-chip-blocked";
}

function scoreColor(score: number) {
  if (score >= 70) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

export function ProviderEvaluationPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId ?? "";
  const allEvals = db.evaluations
    .filter((e) => e.supplierId === sid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latest = allEvals[0];
  const cfg = db.evaluationConfig;

  const phaseResults = latest
    ? (["A", "B", "C"] as const).map((dim) => {
        const dimCriteria = cfg.criteria[dim].map((c) => `${dim}:${c}`);
        const sum = dimCriteria.reduce((acc, key) => acc + (latest.scores[key] ?? 0), 0);
        const pct = (sum / (dimCriteria.length * 5)) * 100;
        return { dim, label: cfg.phaseLabels[dim], pct, weight: cfg.weights[dim], criteria: cfg.criteria[dim] };
      })
    : [];

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Mi evaluación</strong>
      </div>
      <h1 className="wf-page-title">Mi evaluación de desempeño</h1>

      {latest ? (
        <>
          {/* Score principal */}
          <div className="wf-card mb-6 max-w-xl">
            <div className="mb-2 text-sm" style={{ color: "var(--wf-text-muted)" }}>
              Evaluación más reciente — {latest.createdAt.slice(0, 10)}
            </div>
            <div className="text-6xl font-bold mb-2" style={{ color: scoreColor(latest.finalScore) }}>
              {latest.finalScore.toFixed(1)}
              <span className="text-xl font-normal text-[#999]"> / 100</span>
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-[#eee] rounded-full h-3 mb-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{ width: `${latest.finalScore}%`, backgroundColor: scoreColor(latest.finalScore) }}
              />
            </div>
            <span className={`wf-chip ${categoryChip(latest.category)}`}>{latest.category}</span>
            <p className="mt-3 text-sm" style={{ color: "var(--wf-text-muted)" }}>
              Próxima evaluación: <strong>{latest.nextReviewDate}</strong>
              {latest.finalScore < 70 ? " (semestral — score menor a 70)" : " (anual)"}
            </p>
          </div>

          {/* Desglose por fase */}
          <h2 className="text-base font-bold mb-3">Desglose por fase</h2>
          <div className="wf-table-wrap mb-6">
            <div className="wf-table-scroll">
              <table className="wf-table">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th className="text-right">Score fase %</th>
                    <th className="text-right">Peso</th>
                    <th>Criterios evaluados</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseResults.map((p) => (
                    <tr key={p.dim}>
                      <td>{p.dim}: {p.label}</td>
                      <td className="text-right font-mono">{p.pct.toFixed(1)}%</td>
                      <td className="text-right font-mono">{(p.weight * 100).toFixed(0)}%</td>
                      <td className="text-xs">{p.criteria.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historial */}
          <h2 className="text-base font-bold mb-3">Historial</h2>
          <div className="wf-table-wrap mb-6">
            <div className="wf-table-scroll">
              <table className="wf-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Score</th>
                    <th>Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {allEvals.map((ev) => (
                    <tr key={ev.id}>
                      <td>{ev.createdAt.slice(0, 10)}</td>
                      <td className="font-mono">{ev.finalScore.toFixed(1)}</td>
                      <td><span className={`wf-chip ${categoryChip(ev.category)}`}>{ev.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="wf-card mb-6 max-w-xl">
          <p className="text-sm font-medium mb-1">Tu evaluación está programada.</p>
          <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
            Serás notificado cuando esté disponible.
          </p>
        </div>
      )}

      <Link className="wf-btn wf-btn-primary no-underline" to="/proveedor/evaluacion/detalle">
        Ver detalle por fases
      </Link>
    </>
  );
}
