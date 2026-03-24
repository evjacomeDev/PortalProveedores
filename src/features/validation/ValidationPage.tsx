import { useState } from "react";
import { toast } from "sonner";
import { approveDoc, rejectDoc } from "../../mock/api";
import { db } from "../../mock/db";

export function ValidationPage() {
  const [reason, setReason] = useState("Falta legibilidad");
  const docs = db.documents.filter((d) => d.status === "En revision" || d.status === "Cargado");

  return (
    <>
      <h1 className="wf-page-title">Bandeja de validación</h1>

      <div className="wf-filters">
        <div className="wf-filters-row">
          <div className="wf-filter-group">
            <span className="wf-filter-label">Proveedor (demo)</span>
            <select className="wf-input" defaultValue="">
              <option value="">Todos</option>
              {db.suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="wf-filter-group">
            <span className="wf-filter-label">Tipo documento</span>
            <input className="wf-input" placeholder="Filtrar…" readOnly />
          </div>
          <div className="wf-filter-group wf-filter-group-wide">
            <span className="wf-filter-label">Motivo rechazo (plantilla)</span>
            <input className="wf-input" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {docs.length === 0 && <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>No hay documentos pendientes de validar.</p>}
        {docs.map((d) => (
          <div key={d.id} className="wf-card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold">{d.documentType}</div>
              <div className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
                Periodo {d.periodId} · {d.status}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="wf-btn wf-btn-primary" onClick={() => approveDoc(d.id).then(() => toast.success("Documento aprobado"))}>
                Aprobar
              </button>
              <button type="button" className="wf-btn wf-btn-secondary" onClick={() => rejectDoc(d.id, reason).then(() => toast.success("Documento rechazado"))}>
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="wf-card mt-6 min-h-[120px] text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Vista previa (demo): placeholder PDF / imagen según tipo de archivo.
      </div>
    </>
  );
}
