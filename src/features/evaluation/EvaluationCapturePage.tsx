import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { createEvaluation, listEvaluations } from "../../mock/api";
import { db } from "../../mock/db";

export function EvaluationCapturePage() {
  const { proveedorId = "" } = useParams();
  const criteria = useMemo(
    () => [...db.evaluationConfig.criteria.A.map((c) => `A:${c}`), ...db.evaluationConfig.criteria.B.map((c) => `B:${c}`), ...db.evaluationConfig.criteria.C.map((c) => `C:${c}`)],
    [],
  );
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(criteria.map((c) => [c, 3])));
  const [history, setHistory] = useState(db.evaluations.filter((e) => e.supplierId === proveedorId));

  const onSave = async () => {
    await createEvaluation(proveedorId, scores);
    setHistory(await listEvaluations(proveedorId));
    toast.success("Evaluación guardada (nueva versión)");
  };

  return (
    <>
      <div className="wf-breadcrumb">
        Evaluación / proveedor <strong>{proveedorId}</strong>
      </div>
      <h1 className="wf-page-title">Captura de evaluación</h1>

      <div className="wf-table-wrap mb-6">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Criterio</th>
                <th>Puntaje (0–5)</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c}>
                  <td>{c}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      className="wf-input max-w-[100px]"
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

      <button type="button" className="wf-btn wf-btn-primary mb-8" onClick={onSave}>
        Guardar versión
      </button>

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
