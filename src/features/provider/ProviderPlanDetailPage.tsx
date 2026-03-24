import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../../mock/db";

export function ProviderPlanDetailPage() {
  const { id = "" } = useParams();
  const plan = db.improvementPlans.find((p) => p.id === id);

  if (!plan) {
    return (
      <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Plan no encontrado.{" "}
        <Link className="wf-link-muted" to="/proveedor/planes">
          Volver al listado
        </Link>
      </p>
    );
  }

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/planes">
          Planes
        </Link>{" "}
        / <strong>{plan.title}</strong>
      </div>
      <h1 className="wf-page-title">{plan.title}</h1>
      <div className="wf-card mb-6 space-y-2 text-sm">
        <p>
          <strong>Hallazgo:</strong> {plan.finding}
        </p>
        <p>
          <strong>Acción requerida:</strong> {plan.actionRequired}
        </p>
        <p>
          <strong>Responsable:</strong> {plan.responsible}
        </p>
        <p>
          <strong>Fecha compromiso:</strong> {plan.dueDate}
        </p>
        <p>
          <strong>Estatus:</strong> <span className="wf-chip wf-chip-validating">{plan.status}</span>
        </p>
      </div>
      <button type="button" className="wf-btn wf-btn-primary" onClick={() => toast.success("Evidencia cargada (simulación)")}>
        Cargar evidencia (demo)
      </button>
      <div className="mt-6">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/proveedor/planes">
          Volver
        </Link>
      </div>
    </>
  );
}
