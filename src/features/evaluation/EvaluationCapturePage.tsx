import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { createEvaluation, listEvaluations } from "../../mock/api";
import { db } from "../../mock/db";
import type { EvaluationCategory } from "../../mock/types";

function scoreToCategory(score: number): EvaluationCategory {
  if (score >= 85) return "EXCELENTE";
  if (score >= 70) return "CONFIABLE";
  if (score >= 60) return "REGULAR";
  if (score >= 50) return "EN DESARROLLO";
  return "RIESGO ALTO";
}

function categoryChip(cat: EvaluationCategory) {
  if (cat === "EXCELENTE" || cat === "CONFIABLE") return "wf-chip-active";
  if (cat === "REGULAR") return "wf-chip-validating";
  if (cat === "EN DESARROLLO") return "wf-chip-preregistered";
  return "wf-chip-blocked";
}

export function EvaluationCapturePage() {
  const { proveedorId = "" } = useParams();
  const cfg = db.evaluationConfig;
  const phaseLabels = cfg.phaseLabels;
  const supplier = db.suppliers.find((s) => s.id === proveedorId);

  const phaseA = useMemo(() => cfg.criteria.A.map((c) => `A:${c}`), []);
  const phaseB = useMemo(() => cfg.criteria.B.map((c) => `B:${c}`), []);
  const phaseC = useMemo(() => cfg.criteria.C.map((c) => `C:${c}`), []);
  const allCriteria = useMemo(() => [...phaseA, ...phaseB, ...phaseC], [phaseA, phaseB, phaseC]);

  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(allCriteria.map((c) => [c, 3]))
  );
  const [history, setHistory] = useState(db.evaluations.filter((e) => e.supplierId === proveedorId));
  const [step, setStep] = useState(1);

  const onSave = async () => {
    await createEvaluation(proveedorId, scores);
    setHistory(await listEvaluations(proveedorId));
    toast.success("Evaluación guardada (nueva versión)");
    setStep(1);
  };

  const renderStepContent = () => {
    if (step === 4) {
      const phaseResults = (["A", "B", "C"] as const).map((dim) => {
        const dimCriteria = cfg.criteria[dim].map((c) => `${dim}:${c}`);
        const sum = dimCriteria.reduce((acc, key) => acc + (scores[key] ?? 0), 0);
        const pct = (sum / (dimCriteria.length * 5)) * 100;
        return { dim, label: phaseLabels[dim], pct, weight: cfg.weights[dim] };
      });
      const finalScore = phaseResults.reduce((acc, p) => acc + p.pct * p.weight, 0);
      const category = scoreToCategory(finalScore);
      const d = new Date();
      d.setMonth(d.getMonth() + (finalScore < 70 ? 6 : 12));
      const nextReview = d.toISOString().slice(0, 10);

      let scoreColor = "#16a34a";
      if (finalScore < 50) scoreColor = "#dc2626";
      else if (finalScore < 70) scoreColor = "#d97706";

      return (
        <div className="wf-card mb-6">
          <h2 className="mb-6 text-lg font-bold text-center">Resumen de Evaluación Proyectado</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="text-6xl font-bold mb-3" style={{ color: scoreColor }}>
              {finalScore.toFixed(1)}
              <span className="text-xl font-normal text-[#999]"> / 100</span>
            </div>
            <span className={`wf-chip ${categoryChip(category)} text-sm px-4 py-1`}>{category}</span>
          </div>

          <div className="wf-table-wrap mb-4">
            <div className="wf-table-scroll">
              <table className="wf-table">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th className="text-right">Score %</th>
                    <th className="text-right">Peso</th>
                    <th className="text-right">Contribución</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseResults.map((p) => (
                    <tr key={p.dim}>
                      <td>{p.dim}: {p.label}</td>
                      <td className="text-right font-mono">{p.pct.toFixed(1)}%</td>
                      <td className="text-right font-mono">{(p.weight * 100).toFixed(0)}%</td>
                      <td className="text-right font-mono">{(p.pct * p.weight).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-center mb-6" style={{ color: "var(--wf-text-muted)" }}>
            Próxima evaluación: <strong>{nextReview}</strong>
            {finalScore < 70 ? " (semestral — score menor a 70)" : " (anual)"}
          </p>

          <div className="flex gap-4 justify-center">
            <button type="button" className="wf-btn wf-btn-secondary" onClick={() => setStep(3)}>Atrás</button>
            <button type="button" className="wf-btn wf-btn-primary" onClick={onSave}>Confirmar y Guardar Evaluación</button>
          </div>
        </div>
      );
    }

    const currentCriteria = step === 1 ? phaseA : step === 2 ? phaseB : phaseC;
    const stepTitle =
      step === 1
        ? `Fase 1: ${phaseLabels.A}`
        : step === 2
          ? `Fase 2: ${phaseLabels.B}`
          : `Fase 3: ${phaseLabels.C}`;

    return (
      <div className="mb-6">
        <h2 className="mb-4 font-bold text-lg">{stepTitle}</h2>
        <div className="wf-table-wrap">
          <div className="wf-table-scroll">
            <table className="wf-table">
              <thead>
                <tr>
                  <th>Criterio evaluado</th>
                  <th className="w-32 text-center">Puntaje (0–5)</th>
                </tr>
              </thead>
              <tbody>
                {currentCriteria.map((c) => (
                  <tr key={c}>
                    <td>{c.substring(2)}</td>
                    <td className="text-center">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        className="wf-input w-24 mx-auto text-center"
                        value={scores[c]}
                        onChange={(e) => setScores((s) => ({ ...s, [c]: Number(e.target.value) }))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button type="button" className="wf-btn wf-btn-secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
            Anterior
          </button>
          <button type="button" className="wf-btn wf-btn-primary" onClick={() => setStep(s => Math.min(4, s + 1))}>
            {step === 3 ? "Revisar Resumen" : "Siguiente Fase"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="wf-breadcrumb">
        Evaluación / <strong>{supplier?.name ?? proveedorId}</strong> / Captura
      </div>
      <h1 className="wf-page-title mb-2">Captura de evaluación</h1>

      <div className="flex gap-2 mb-6 text-sm flex-wrap">
        <span className={step >= 1 ? "font-bold text-[#e63946]" : "text-[#999]"}>1. {phaseLabels.A}</span> <span className="text-[#999]">/</span>
        <span className={step >= 2 ? "font-bold text-[#e63946]" : "text-[#999]"}>2. {phaseLabels.B}</span> <span className="text-[#999]">/</span>
        <span className={step >= 3 ? "font-bold text-[#e63946]" : "text-[#999]"}>3. {phaseLabels.C}</span> <span className="text-[#999]">/</span>
        <span className={step >= 4 ? "font-bold text-[#e63946]" : "text-[#999]"}>4. Resumen</span>
      </div>

      {renderStepContent()}

      <h2 className="mb-3 text-base font-bold">Histórico</h2>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Calificación</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>{new Date(h.createdAt).toLocaleString()}</td>
                  <td>{h.finalScore.toFixed(1)}</td>
                  <td>
                    <span className={`wf-chip ${categoryChip(h.category)}`}>{h.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
