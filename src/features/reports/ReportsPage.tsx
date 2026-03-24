import { exportCSV } from "../../mock/api";
import { db } from "../../mock/db";

export function ReportsPage() {
  const compliance = db.suppliers.map((s) => ({
    proveedor: s.name,
    periodosAprobados: db.periods.filter((p) => p.supplierId === s.id && p.status === "Aprobado").length,
  }));
  const overdue = db.periods.filter((p) => p.status === "Vencido").map((p) => ({ periodo: p.label, contrato: p.contractId, proveedor: p.supplierId }));

  return (
    <>
      <h1 className="wf-page-title">Reportes y bitácora</h1>
      <div className="wf-actions-bar justify-start gap-3">
        <button type="button" className="wf-btn wf-btn-primary" onClick={() => exportCSV(compliance, "cumplimiento_proveedor.csv")}>
          Reporte cumplimiento (CSV)
        </button>
        <button type="button" className="wf-btn wf-btn-secondary" onClick={() => exportCSV(overdue, "periodos_vencidos.csv")}>
          Periodos vencidos (CSV)
        </button>
      </div>
      <h2 className="mb-2 mt-6 text-base font-bold">Bitácora / auditoría (demo)</h2>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {db.auditEvents.slice(0, 20).map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap text-xs">{new Date(e.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="wf-chip wf-chip-preregistered">{e.type}</span>
                  </td>
                  <td>{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
