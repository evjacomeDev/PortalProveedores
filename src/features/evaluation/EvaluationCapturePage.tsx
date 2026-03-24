import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { createEvaluation, listEvaluations } from "../../mock/api";
import { db } from "../../mock/db";

export function EvaluationCapturePage() {
  const { proveedorId = "" } = useParams();
  
  const phaseA = useMemo(() => db.evaluationConfig.criteria.A.map((c) => `A:${c}`), []);
  const phaseB = useMemo(() => db.evaluationConfig.criteria.B.map((c) => `B:${c}`), []);
  const phaseC = useMemo(() => db.evaluationConfig.criteria.C.map((c) => `C:${c}`), []);
  const allCriteria = useMemo(() => [...phaseA, ...phaseB, ...phaseC], [phaseA, phaseB, phaseC]);
  
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(allCriteria.map((c) => [c, 3])));
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
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const maxScore = allCriteria.length * 5;
      const finalScore = (totalScore / maxScore) * 100;
      let semaforo = "wf-chip-active";
      if (finalScore < 70) semaforo = "wf-chip-blocked";
      else if (finalScore < 85) semaforo = "wf-chip-validating";
      
      return (
        <div className="wf-card mb-6 items-center flex flex-col justify-center py-10">
          <h2 className="mb-4 text-lg font-bold">Resumen de Evaluación Proyectado</h2>
          <div className="text-5xl font-bold mb-4" style={{ color: "var(--wf-text)" }}>
            {finalScore.toFixed(1)} <span className="text-xl font-normal text-[#999]">/ 100</span>
          </div>
          <div className="mb-8">
            <span className={`wf-chip ${semaforo} text-sm px-4 py-1`}>
              {finalScore >= 85 ? "Excelente" : finalScore >= 70 ? "Regular" : "Riesgo"}
            </span>
          </div>
          <div className="flex gap-4">
             <button type="button" className="wf-btn wf-btn-secondary" onClick={() => setStep(3)}>Atrás</button>
             <button type="button" className="wf-btn wf-btn-primary" onClick={onSave}>Confirmar y Guardar Evaluación</button>
          </div>
        </div>
      );
    }

    const currentCriteria = step === 1 ? phaseA : step === 2 ? phaseB : phaseC;
    const stepTitle = step === 1 ? "Fase 1: Potencial" : step === 2 ? "Fase 2: Funcionamiento actual" : "Fase 3: Capacidad estratégica";

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
        Evaluación / proveedor <strong>{proveedorId}</strong>
      </div>
      <h1 className="wf-page-title mb-2">Captura de evaluación</h1>
      
      <div className="flex gap-2 mb-6 text-sm flex-wrap">
         <span className={step >= 1 ? "font-bold text-[#e63946]" : "text-[#999]"}>1. Potencial</span> <span className="text-[#999]">/</span>
         <span className={step >= 2 ? "font-bold text-[#e63946]" : "text-[#999]"}>2. Funcionamiento</span> <span className="text-[#999]">/</span>
         <span className={step >= 3 ? "font-bold text-[#e63946]" : "text-[#999]"}>3. Estrategia</span> <span className="text-[#999]">/</span>
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
                    <span className="wf-chip wf-chip-active">{h.category}</span>
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
