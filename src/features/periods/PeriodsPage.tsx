import { Link, useParams } from "react-router-dom";
import { db } from "../../mock/db";

const periodChip: Record<string, string> = {
  Abierto: "wf-chip wf-chip-preregistered",
  "En captura": "wf-chip wf-chip-validating",
  "En validacion": "wf-chip wf-chip-risk",
  Aprobado: "wf-chip wf-chip-active",
  Vencido: "wf-chip wf-chip-blocked",
};

export function PeriodsPage() {
  const { id = "" } = useParams();
  const contract = db.contracts.find((c) => c.id === id);
  const periods = db.periods.filter((p) => p.contractId === id);

  return (
    <>
      <div className="wf-breadcrumb">
        Contratos / {contract?.service ?? id} / <strong>Periodos REPSE</strong>
      </div>
      <h1 className="wf-page-title">Periodos por contrato</h1>

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Vencimiento</th>
                <th>Estatus</th>
                <th>Expediente</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold">{p.label}</td>
                  <td>{p.dueDate}</td>
                  <td>
                    <span className={periodChip[p.status] ?? "wf-chip wf-chip-inactive"}>{p.status}</span>
                  </td>
                  <td>
                    <Link className="wf-action-btn inline-block no-underline" to={`/app/expediente/${p.supplierId}/${id}/${p.id}`}>
                      Abrir expediente
                    </Link>
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
