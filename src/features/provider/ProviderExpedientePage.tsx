import { useParams } from "react-router-dom";
import { db } from "../../mock/db";

export function ProviderExpedientePage() {
  const { periodoId = "" } = useParams();
  const period = db.periods.find((p) => p.id === periodoId);
  const docs = db.documents.filter((d) => d.periodId === periodoId);

  return (
    <>
      <div className="wf-breadcrumb">
        Periodos / <strong>{period?.label ?? periodoId}</strong> / Expediente
      </div>
      <h1 className="wf-page-title">Expediente del periodo</h1>
      <div className="wf-provider-header mb-6">
        <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Estado del periodo: <strong>{period?.status}</strong>
        </p>
      </div>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Sección</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td>{d.documentType}</td>
                  <td>{d.section}</td>
                  <td>
                    <span className="wf-chip wf-chip-active">{d.status}</span>
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
