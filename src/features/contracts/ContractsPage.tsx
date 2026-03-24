import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { createContract, listContracts } from "../../mock/api";
import { db } from "../../mock/db";

export function ContractsPage() {
  const { id = "" } = useParams();
  const [contracts, setContracts] = useState(db.contracts.filter((c) => c.supplierId === id));
  const [service, setService] = useState("");
  const supplier = db.suppliers.find((s) => s.id === id);

  const refresh = async () => setContracts(await listContracts(id));

  const onCreate = async () => {
    try {
      await createContract({ supplierId: id, society: "Sociedad MX", service: service || "Servicio demo", startDate: "2026-01-01", endDate: "2026-12-31" });
      toast.success("Contrato creado");
      setService("");
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <div className="wf-breadcrumb">
        Proveedores / {supplier?.name ?? id} / <strong>Contratos</strong>
      </div>
      <h1 className="wf-page-title">Gestión de contratos</h1>

      <div className="wf-filters">
        <div className="wf-filters-row">
          <div className="wf-filter-group wf-filter-group-wide">
            <span className="wf-filter-label">Servicio (alta demo)</span>
            <input className="wf-input" value={service} placeholder="Ej. Limpieza, Seguridad…" onChange={(e) => setService(e.target.value)} />
          </div>
        </div>
        <button type="button" className="wf-btn wf-btn-primary" onClick={onCreate}>
          Alta contrato
        </button>
      </div>

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Sociedad</th>
                <th>Servicio</th>
                <th>Vigencia</th>
                <th>Estatus</th>
                <th>Periodos</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id}>
                  <td>{c.society}</td>
                  <td>{c.service}</td>
                  <td>
                    {c.startDate} — {c.endDate}
                  </td>
                  <td>
                    <span className="wf-chip wf-chip-validating">{c.status}</span>
                  </td>
                  <td>
                    <Link className="wf-action-btn inline-block no-underline" to={`/app/contratos/${c.id}/periodos`}>
                      Ver periodos
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
