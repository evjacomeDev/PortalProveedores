import { Link, useParams } from "react-router-dom";
import { SupplierStatusBadge } from "../../components/common/StatusBadge";
import { db } from "../../mock/db";

export function ProviderDetailPage() {
  const { id = "" } = useParams();
  const supplier = db.suppliers.find((s) => s.id === id);
  const lastEval = db.evaluations
    .filter((e) => e.supplierId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const plans = db.improvementPlans.filter((p) => p.supplierId === id);

  if (!supplier) {
    return <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>Proveedor no encontrado.</p>;
  }

  return (
    <>
      <div className="wf-breadcrumb">
        Proveedores / <strong>{supplier.name}</strong> / Ficha 360°
      </div>
      <h1 className="wf-page-title">Ficha 360° — Proveedor</h1>

      <div className="wf-provider-header">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold">{supplier.name}</span>
          <SupplierStatusBadge status={supplier.status} />
        </div>
        <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Tipo: {supplier.type} · Alta: {supplier.createdAt} · Revisión corta: {supplier.shortReview ? "Sí" : "No"} · Revisión detallada:{" "}
          {supplier.detailedReview ? "Sí" : "No"}
        </p>
        <p className="mt-3 text-sm">
          <strong>Evaluación vigente:</strong>{" "}
          {lastEval ? `${lastEval.finalScore.toFixed(1)} pts — categoría ${lastEval.category}` : "Sin evaluación registrada"}
        </p>
        {plans.length > 0 && (
          <p className="mt-2 text-sm">
            <strong>Planes de mejora activos:</strong> {plans.length}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="wf-btn wf-btn-primary inline-flex items-center justify-center no-underline" to={`/app/proveedores/${id}/expediente`}>
            Expediente
          </Link>
          <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline" to={`/app/proveedores/${id}/contratos`}>
            Contratos
          </Link>
          <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline" to={`/app/validacion`}>
            Validación
          </Link>
          <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline" to={`/app/evaluacion/${id}`}>
            Capturar evaluación
          </Link>
          <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline" to="/app/planes-mejora">
            Planes de mejora
          </Link>
        </div>
      </div>
    </>
  );
}
