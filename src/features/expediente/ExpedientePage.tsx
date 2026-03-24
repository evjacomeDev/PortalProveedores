import { useParams } from "react-router-dom";
import { db } from "../../mock/db";

const docChip: Record<string, string> = {
  Pendiente: "wf-chip wf-chip-inactive",
  Cargado: "wf-chip wf-chip-preregistered",
  "En revision": "wf-chip wf-chip-validating",
  Aprobado: "wf-chip wf-chip-active",
  Rechazado: "wf-chip wf-chip-blocked",
};

export function ExpedientePage() {
  const { proveedorId = "", contratoId = "", periodoId = "" } = useParams();
  const supplier = db.suppliers.find((s) => s.id === proveedorId);
  const contract = db.contracts.find((c) => c.id === contratoId);
  const period = db.periods.find((p) => p.id === periodoId);
  const docs = db.documents.filter((d) => d.periodId === periodoId && d.supplierId === proveedorId && d.contractId === contratoId);

  const bySection = ["Alta", "Vigencia", "Mensual", "Cuatrimestral"] as const;

  return (
    <>
      <div className="wf-breadcrumb">
        {supplier?.name} / {contract?.service} / {period?.label} / <strong>Expediente digital</strong>
      </div>
      <h1 className="wf-page-title">Expediente digital</h1>

      <div className="wf-provider-header mb-6">
        <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Proveedor: <strong>{supplier?.name}</strong> · Contrato: <strong>{contract?.service}</strong> · Periodo: <strong>{period?.label}</strong> · Estado periodo:{" "}
          <strong>{period?.status}</strong>
        </p>
      </div>

      {bySection.map((section) => {
        const sectionDocs = docs.filter((d) => d.section === section);
        if (!sectionDocs.length) return null;
        return (
          <div key={section} className="mb-6">
            <h2 className="mb-3 text-base font-bold" style={{ color: "var(--wf-text)" }}>
              {section}
            </h2>
            <div className="wf-table-wrap">
              <div className="wf-table-scroll">
                <table className="wf-table">
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Estatus</th>
                      <th>Archivo</th>
                      <th>Validador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionDocs.map((d) => (
                      <tr key={d.id}>
                        <td>{d.documentType}</td>
                        <td>
                          <span className={docChip[d.status] ?? "wf-chip wf-chip-inactive"}>{d.status}</span>
                        </td>
                        <td>{d.fileName ?? "—"}</td>
                        <td className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
                          {d.validatorComment ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
