import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { clearRegistroDraft, loadRegistroDraft } from "./wizardStorage";
import { db } from "../../mock/db";

export function RegisterConfirmacionPage() {
  const [d] = useState(() => loadRegistroDraft());

  const onFinish = () => {
    db.auditEvents.unshift({
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: "registro_potencial",
      message: `Nueva solicitud demo: ${d.razonSocial || "Sin razón social"} — notificación al área (simulada)`,
    });
    toast.success("Solicitud registrada. El área interna recibirá un aviso en la bitácora demo (FR-14).");
    clearRegistroDraft();
  };

  return (
    <>
      <div className="wf-card">
        <h1 className="wf-page-title text-xl">Confirmación y estatus</h1>
        <p className="mb-4 text-sm font-medium text-[#333]">Estatus: <span className="wf-chip wf-chip-validating">En revisión</span></p>
        <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Resumen de lo capturado (FR-13). En producción aquí persistiría el folio y seguimiento.
        </p>
        <dl className="grid gap-2 text-sm md:grid-cols-2">
          <dt style={{ color: "var(--wf-text-muted)" }}>Razón social</dt>
          <dd className="font-medium">{d.razonSocial || "—"}</dd>
          <dt style={{ color: "var(--wf-text-muted)" }}>RFC</dt>
          <dd className="font-medium">{d.rfc || "—"}</dd>
          <dt style={{ color: "var(--wf-text-muted)" }}>Clasificación</dt>
          <dd className="font-medium">{d.clasificacion || "—"}</dd>
          <dt style={{ color: "var(--wf-text-muted)" }}>Correo</dt>
          <dd className="font-medium">{d.correo || "—"}</dd>
        </dl>
        <button type="button" className="wf-btn wf-btn-primary mt-8" onClick={onFinish}>
          Finalizar y registrar en bitácora (demo)
        </button>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/registro/documentos">
          Anterior
        </Link>
        <Link className="wf-btn wf-btn-secondary ml-auto no-underline" to="/">
          Volver al inicio
        </Link>
        <Link className="wf-btn wf-btn-primary no-underline" to="/registro/seguimiento/demo">
          Ver pantalla de seguimiento
        </Link>
      </div>
    </>
  );
}
