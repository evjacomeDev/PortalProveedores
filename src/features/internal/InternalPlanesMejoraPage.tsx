import { Link } from "react-router-dom";
import { db } from "../../mock/db";

export function InternalPlanesMejoraPage() {
  return (
    <>
      <div className="wf-breadcrumb">
        Inicio / <strong>Planes de mejora</strong>
      </div>
      <h1 className="wf-page-title">Planes de mejora (interno)</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Seguimiento y cierre (FR-55–57). Vista consolidada demo.
      </p>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Plan</th>
                <th>Responsable</th>
                <th>Vence</th>
                <th>Estatus</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {db.improvementPlans.map((p) => {
                const sup = db.suppliers.find((s) => s.id === p.supplierId);
                return (
                  <tr key={p.id}>
                    <td>{sup?.name ?? p.supplierId}</td>
                    <td className="font-medium">{p.title}</td>
                    <td>{p.responsible}</td>
                    <td>{p.dueDate}</td>
                    <td>
                      <span className="wf-chip wf-chip-validating">{p.status}</span>
                    </td>
                    <td>
                      <Link className="wf-action-btn no-underline" to={`/app/planes-mejora/${p.id}`}>
                        Detalle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/app/dashboard">
          Dashboard
        </Link>
        <Link className="wf-btn wf-btn-primary no-underline" to="/app/proveedores">
          Listado proveedores
        </Link>
      </div>
    </>
  );
}
