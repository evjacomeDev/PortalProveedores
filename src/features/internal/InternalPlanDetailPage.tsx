import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../../mock/db";

export function InternalPlanDetailPage() {
  const { id = "" } = useParams();
  const plan = db.improvementPlans.find((p) => p.id === id);
  const sup = plan ? db.suppliers.find((s) => s.id === plan.supplierId) : undefined;

  if (!plan) {
    return (
      <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Plan no encontrado.{" "}
        <Link className="wf-link-muted" to="/app/planes-mejora">
          Volver
        </Link>
      </p>
    );
  }

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/app/planes-mejora">
          Planes
        </Link>{" "}
        / <strong>{plan.title}</strong>
      </div>
      <h1 className="wf-page-title">{plan.title}</h1>
      <p className="mb-4 text-sm">
        Proveedor: <strong>{sup?.name}</strong>
      </p>
      <div className="wf-card mb-6 space-y-2 text-sm">
        <p>
          <strong>Hallazgo:</strong> {plan.finding}
        </p>
        <p>
          <strong>Acción:</strong> {plan.actionRequired}
        </p>
        <p>
          <strong>Responsable:</strong> {plan.responsible}
        </p>
        <p>
          <strong>Vence:</strong> {plan.dueDate}
        </p>
        <p>
          <strong>Estatus:</strong> {plan.status}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="wf-btn wf-btn-primary" onClick={() => toast.success("Evidencia revisada (demo)")}>
          Revisar evidencia
        </button>
        <button type="button" className="wf-btn wf-btn-secondary" onClick={() => toast.success("Plan cerrado (demo)")}>
          Cerrar plan
        </button>
      </div>
      <div className="mt-6">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/app/planes-mejora">
          Volver al listado
        </Link>
      </div>
    </>
  );
}
