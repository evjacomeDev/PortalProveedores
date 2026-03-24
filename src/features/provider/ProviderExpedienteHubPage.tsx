import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderExpedienteHubPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId;
  const supplier = db.suppliers.find((s) => s.id === sid);
  const docs = db.documents.filter((d) => d.supplierId === sid);
  const periods = db.periods.filter((p) => p.supplierId === sid);

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Mi expediente</strong>
      </div>
      <h1 className="wf-page-title">Mi expediente</h1>
      <p className="mb-6 max-w-3xl text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Resumen documental y vigencias (FR-20). Los detalles por periodo operativo están en la sección Operación.
      </p>

      <div className="wf-kpi-row mb-8">
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-blue" />
          <div className="wf-kpi-title">Documentos en expediente</div>
          <div className="wf-kpi-value">{docs.length}</div>
        </div>
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-orange" />
          <div className="wf-kpi-title">Periodos activos</div>
          <div className="wf-kpi-value">{periods.length}</div>
        </div>
        <div className="wf-kpi-card">
          <span className="wf-kpi-dot wf-dot-green" />
          <div className="wf-kpi-title">Proveedor</div>
          <div className="wf-kpi-value text-base">{supplier?.name ?? "—"}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-primary no-underline" to="/proveedor/documentos">
          Ir a mis documentos
        </Link>
        <Link className="wf-btn wf-btn-secondary no-underline" to="/proveedor/operacion/periodos">
          Ver periodos (operación)
        </Link>
      </div>
    </>
  );
}
