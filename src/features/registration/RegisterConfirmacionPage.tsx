import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { clearRegistroDraft, loadRegistroDraft } from "./wizardStorage";
import { db } from "../../mock/db";

export function RegisterConfirmacionPage() {
  const [d] = useState(() => loadRegistroDraft());
  const [registered, setRegistered] = useState(false);

  const onFinish = () => {
    const nombre = d.razonSocial?.trim() || "Proveedor sin nombre";
    const tipo = d.clasificacion || "General";

    // Agregar a db.suppliers como Pre-registrado para que aparezca en la lista interna
    const nuevoId = `s_reg_${Date.now()}`;
    db.suppliers.unshift({
      id: nuevoId,
      name: nombre,
      type: tipo,
      status: "Pre-registrado",
      createdAt: new Date().toISOString().slice(0, 10),
      shortReview: false,
      detailedReview: false,
    });

    db.auditEvents.unshift({
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: "registro_potencial",
      message: `Nueva solicitud de registro: ${nombre} (${tipo}) — pendiente de revisión interna`,
    });

    toast.success("Solicitud registrada. El área de Compras recibirá un aviso (demo).");
    clearRegistroDraft();
    setRegistered(true);
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
        {registered ? (
          <div className="mt-6 rounded-md border p-4 text-sm"
            style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#166534" }}>
            <p className="font-bold mb-1">✓ Solicitud enviada correctamente</p>
            <p>Tu empresa quedó registrada con estatus <strong>Pre-registrado</strong>. El equipo de Compras la revisará y recibirás confirmación por correo.</p>
          </div>
        ) : (
          <button type="button" className="wf-btn wf-btn-primary mt-8" onClick={onFinish}>
            Finalizar y enviar solicitud
          </button>
        )}
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
