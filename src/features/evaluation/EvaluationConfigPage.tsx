import { db } from "../../mock/db";

export function EvaluationConfigPage() {
  const { weights, criteria } = db.evaluationConfig;
  return (
    <>
      <h1 className="wf-page-title">Configuración de evaluación (A / B / C)</h1>
      <div className="wf-card mb-4">
        <p className="mb-2 text-sm font-bold">Pesos dimensionales</p>
        <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
          A: {weights.A} · B: {weights.B} · C: {weights.C}
        </p>
      </div>
      {(["A", "B", "C"] as const).map((dim) => (
        <div key={dim} className="wf-card mb-3">
          <h2 className="mb-2 text-sm font-bold">Dimensión {dim}</h2>
          <ul className="list-inside list-disc text-sm" style={{ color: "var(--wf-text-soft)" }}>
            {criteria[dim].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
        Rangos categoría APTO / EN DESARROLLO / NO APTO: según cálculo demo en captura.
      </p>
    </>
  );
}
