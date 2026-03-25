<<<<<<< HEAD
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
=======
import { useState } from "react";
import { toast } from "sonner";
import { db } from "../../mock/db";

const CATEGORY_RANGES = [
  { label: "EXCELENTE", min: 85, max: 100, chip: "wf-chip-active" },
  { label: "CONFIABLE", min: 70, max: 84, chip: "wf-chip-active" },
  { label: "REGULAR", min: 60, max: 69, chip: "wf-chip-validating" },
  { label: "EN DESARROLLO", min: 50, max: 59, chip: "wf-chip-preregistered" },
  { label: "RIESGO ALTO", min: 0, max: 49, chip: "wf-chip-blocked" },
];

export function EvaluationConfigPage() {
  const [weights, setWeights] = useState({ ...db.evaluationConfig.weights });
  const [labels, setLabels] = useState({ ...db.evaluationConfig.phaseLabels });
  const [criteria, setCriteria] = useState({
    A: [...db.evaluationConfig.criteria.A],
    B: [...db.evaluationConfig.criteria.B],
    C: [...db.evaluationConfig.criteria.C],
  });

  const total = +(weights.A + weights.B + weights.C).toFixed(2);
  const isValid = total === 1.0;

  function save() {
    if (!isValid) { toast.error("Los pesos deben sumar exactamente 1.0"); return; }
    db.evaluationConfig.weights = { ...weights };
    db.evaluationConfig.phaseLabels = { ...labels };
    db.evaluationConfig.criteria = {
      A: [...criteria.A], B: [...criteria.B], C: [...criteria.C],
    };
    toast.success("Configuración de evaluación guardada");
  }

  return (
    <>
      <h1 className="wf-page-title">Configuración de evaluación</h1>

      {/* Fórmula visual */}
      <div className="wf-card mb-6 bg-[#f8f8f8]">
        <p className="text-xs font-bold mb-1" style={{ color: "var(--wf-text-muted)" }}>
          Fórmula
        </p>
        <p className="text-sm font-mono">
          Calificación (%) = ({labels.A} × {weights.A}) + ({labels.B} × {weights.B}) + ({labels.C} × {weights.C})
        </p>
        <p className={`mt-2 text-xs font-bold ${isValid ? "text-green-700" : "text-red-600"}`}>
          Suma pesos: {total} {isValid ? "✓" : "← debe ser 1.0"}
        </p>
      </div>

      {/* Pesos y criterios por fase */}
      {(["A", "B", "C"] as const).map((dim) => (
        <div key={dim} className="wf-card mb-4">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h2 className="font-bold text-sm">Fase {dim}</h2>
            <input
              className="wf-input w-32 text-sm"
              placeholder={`Nombre fase ${dim}`}
              value={labels[dim]}
              onChange={(e) => setLabels((l) => ({ ...l, [dim]: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--wf-text-muted)" }}>Peso:</label>
              <input
                type="number" min={0} max={1} step={0.05}
                className="wf-input w-20 text-center text-sm"
                value={weights[dim]}
                onChange={(e) => setWeights((w) => ({ ...w, [dim]: +e.target.value }))}
              />
            </div>
          </div>
          <ul className="space-y-1">
            {criteria[dim].map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  className="wf-input flex-1 text-sm"
                  value={c}
                  onChange={(e) => {
                    const next = [...criteria[dim]];
                    next[i] = e.target.value;
                    setCriteria((cr) => ({ ...cr, [dim]: next }));
                  }}
                />
                <button
                  type="button" className="wf-action-btn text-xs"
                  onClick={() => setCriteria((cr) => ({ ...cr, [dim]: cr[dim].filter((_, j) => j !== i) }))}
                >Eliminar</button>
              </li>
            ))}
          </ul>
          <button
            type="button" className="wf-btn wf-btn-secondary text-xs mt-2"
            onClick={() => setCriteria((cr) => ({ ...cr, [dim]: [...cr[dim], "Nuevo criterio"] }))}
          >+ Agregar criterio</button>
        </div>
      ))}

      <button type="button" className="wf-btn wf-btn-primary mb-8" onClick={save}>
        Guardar configuración
      </button>

      {/* Tabla de categorías (read-only) */}
      <h2 className="text-base font-bold mb-3">Tabla de categorías</h2>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead><tr><th>Categoría</th><th>Rango (%)</th></tr></thead>
            <tbody>
              {CATEGORY_RANGES.map((r) => (
                <tr key={r.label}>
                  <td><span className={`wf-chip ${r.chip}`}>{r.label}</span></td>
                  <td>{r.min}% – {r.max}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
>>>>>>> cfdacd9 (Cierre de demo commit)
    </>
  );
}
