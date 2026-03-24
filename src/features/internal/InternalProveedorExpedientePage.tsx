import { Link, useParams } from "react-router-dom";
import { db } from "../../mock/db";

export function InternalProveedorExpedientePage() {
  const { id = "" } = useParams();
  const supplier = db.suppliers.find((s) => s.id === id);
  const docs = db.documents.filter((d) => d.supplierId === id);

  if (!supplier) {
    return <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>Proveedor no encontrado.</p>;
  }

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/app/proveedores">
          Proveedores
        </Link>{" "}
        / <Link className="wf-link-muted no-underline" to={`/app/proveedores/${id}`}>{supplier.name}</Link> / <strong>Expediente</strong>
      </div>
      <h1 className="wf-page-title">Expediente — {supplier.name}</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Vista documental interna coherente con validación y ficha 360 (FR-20, FR-33).
      </p>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Sección</th>
                <th>Estatus</th>
                <th>Archivo</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td className="font-medium">{d.documentType}</td>
                  <td>{d.section}</td>
                  <td>
                    <span className="wf-chip wf-chip-validating">{d.status}</span>
                  </td>
                  <td className="text-xs">{d.fileName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-primary no-underline" to={`/app/proveedores/${id}`}>
          Volver a ficha 360
        </Link>
        <Link className="wf-btn wf-btn-secondary no-underline" to="/app/validacion">
          Ir a validación
        </Link>
      </div>
    </>
  );
}
