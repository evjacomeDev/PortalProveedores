import { useState } from "react";
import { toast } from "sonner";
import { approveDoc, rejectDoc } from "../../mock/api";
import { db } from "../../mock/db";
import type { DocumentSection, DocumentStatus } from "../../mock/types";

type DocRow = (typeof db.documents)[number];

const STATUS_FILTER: { value: DocumentStatus | "pendientes"; label: string }[] = [
  { value: "pendientes",   label: "Pendientes (Cargado + En revisión)" },
  { value: "Cargado",      label: "Cargado" },
  { value: "En revision",  label: "En revisión" },
  { value: "Aprobado",     label: "Aprobado" },
  { value: "Rechazado",    label: "Rechazado" },
];

const SECTIONS: { value: DocumentSection | ""; label: string }[] = [
  { value: "",           label: "Todas las secciones" },
  { value: "Empresa",    label: "Empresa" },
  { value: "Tecnico",    label: "Técnico" },
  { value: "Vigencia",   label: "REPSE — Vigencia" },
  { value: "Mensual",    label: "REPSE — Mensual" },
  { value: "Alta",       label: "Alta" },
];

function statusChip(status: DocumentStatus) {
  const map: Record<DocumentStatus, string> = {
    Cargado:      "wf-chip-validating",
    "En revision":"wf-chip-validating",
    Aprobado:     "wf-chip-active",
    Rechazado:    "wf-chip-blocked",
    Pendiente:    "wf-chip-preregistered",
  };
  return map[status] ?? "wf-chip-preregistered";
}

function supplierName(supplierId: string) {
  return db.suppliers.find((s) => s.id === supplierId)?.name ?? supplierId;
}

function periodLabel(periodId: string) {
  return db.periods.find((p) => p.id === periodId)?.label ?? periodId;
}

export function ValidationPage() {
  const [, refresh] = useState(0);
  const forceRefresh = () => refresh((n) => n + 1);

  // Filtros
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterStatus, setFilterStatus]     = useState<DocumentStatus | "pendientes">("pendientes");
  const [filterSection, setFilterSection]   = useState<DocumentSection | "">("");
  const [filterText, setFilterText]         = useState("");

  // Panel de detalle / motivo rechazo por documento
  const [selected, setSelected]   = useState<DocRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [working, setWorking]     = useState(false);

  // Documentos filtrados
  const docs = db.documents.filter((d) => {
    const matchSupplier = !filterSupplier || d.supplierId === filterSupplier;
    const matchStatus =
      filterStatus === "pendientes"
        ? d.status === "Cargado" || d.status === "En revision"
        : d.status === filterStatus;
    const matchSection  = !filterSection || d.section === filterSection;
    const matchText     = !filterText ||
      d.documentType.toLowerCase().includes(filterText.toLowerCase()) ||
      supplierName(d.supplierId).toLowerCase().includes(filterText.toLowerCase());
    return matchSupplier && matchStatus && matchSection && matchText;
  });

  // Proveedores que tienen documentos en la bandeja actual
  const suppliersWithDocs = db.suppliers.filter((s) =>
    db.documents.some((d) => {
      const matchStatus =
        filterStatus === "pendientes"
          ? d.status === "Cargado" || d.status === "En revision"
          : d.status === filterStatus;
      return d.supplierId === s.id && matchStatus;
    })
  );

  // KPIs
  const totalPendientes = db.documents.filter(
    (d) => d.status === "Cargado" || d.status === "En revision"
  ).length;
  const totalProvsPendientes = new Set(
    db.documents
      .filter((d) => d.status === "Cargado" || d.status === "En revision")
      .map((d) => d.supplierId)
  ).size;
  const totalAprobados = db.documents.filter((d) => d.status === "Aprobado").length;
  const totalRechazados = db.documents.filter((d) => d.status === "Rechazado").length;

  async function handleApprove(doc: DocRow) {
    setWorking(true);
    try {
      await approveDoc(doc.id);
      toast.success(`"${doc.documentType}" aprobado`);
      if (selected?.id === doc.id) setSelected(null);
      forceRefresh();
    } finally { setWorking(false); }
  }

  async function handleReject(doc: DocRow) {
    if (!rejectReason.trim()) {
      toast.error("Escribe el motivo de rechazo");
      return;
    }
    setWorking(true);
    try {
      await rejectDoc(doc.id, rejectReason);
      toast.success(`"${doc.documentType}" rechazado`);
      setRejectReason("");
      if (selected?.id === doc.id) setSelected(null);
      forceRefresh();
    } finally { setWorking(false); }
  }

  function clearFilters() {
    setFilterSupplier("");
    setFilterStatus("pendientes");
    setFilterSection("");
    setFilterText("");
  }

  return (
    <>
      <h1 className="wf-page-title">Bandeja de validación</h1>

      {/* KPIs */}
      <div className="wf-kpi-row mb-6">
        {[
          { t: "Pendientes",          v: totalPendientes,       dot: "wf-dot-yellow" },
          { t: "Proveedores activos", v: totalProvsPendientes,  dot: "wf-dot-blue" },
          { t: "Aprobados",           v: totalAprobados,        dot: "wf-dot-green" },
          { t: "Rechazados",          v: totalRechazados,       dot: "wf-dot-red" },
        ].map((k) => (
          <div key={k.t} className="wf-kpi-card">
            <span className={`wf-kpi-dot ${k.dot}`} />
            <div className="wf-kpi-title">{k.t}</div>
            <div className="wf-kpi-value">{k.v}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="wf-filters mb-4">
        <div className="wf-filters-row flex-wrap gap-3">
          {/* Proveedor */}
          <div className="wf-filter-group" style={{ minWidth: "200px" }}>
            <span className="wf-filter-label">Proveedor</span>
            <select
              className="wf-input"
              value={filterSupplier}
              onChange={(e) => { setFilterSupplier(e.target.value); setSelected(null); }}
            >
              <option value="">Todos los proveedores</option>
              {suppliersWithDocs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Estatus */}
          <div className="wf-filter-group">
            <span className="wf-filter-label">Estatus</span>
            <select
              className="wf-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | "pendientes")}
            >
              {STATUS_FILTER.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Sección */}
          <div className="wf-filter-group">
            <span className="wf-filter-label">Sección</span>
            <select
              className="wf-input"
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value as DocumentSection | "")}
            >
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Búsqueda libre */}
          <div className="wf-filter-group wf-filter-group-wide">
            <span className="wf-filter-label">Buscar documento</span>
            <input
              className="wf-input"
              placeholder="Nombre del documento…"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <button type="button" className="wf-btn wf-btn-secondary" onClick={clearFilters}>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Layout: tabla + panel detalle */}
      <div className="flex gap-4 min-h-0" style={{ alignItems: "flex-start" }}>

        {/* Tabla documentos */}
        <div className="flex-1 min-w-0">
          {docs.length === 0 ? (
            <div className="wf-card text-sm text-center py-8" style={{ color: "var(--wf-text-muted)" }}>
              {filterSupplier
                ? `${supplierName(filterSupplier)} no tiene documentos con este filtro.`
                : "No hay documentos con este filtro."}
            </div>
          ) : (
            <div className="wf-table-wrap">
              <div className="wf-table-scroll">
                <table className="wf-table">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Documento</th>
                      <th>Sección</th>
                      <th>Periodo</th>
                      <th>Cargado</th>
                      <th>Estatus</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr
                        key={d.id}
                        className={selected?.id === d.id ? "bg-blue-50" : ""}
                        style={{ cursor: "pointer" }}
                        onClick={() => { setSelected(d); setRejectReason(""); }}
                      >
                        <td className="text-sm font-medium">{supplierName(d.supplierId)}</td>
                        <td className="text-sm">{d.documentType}</td>
                        <td>
                          <span className="wf-chip wf-chip-preregistered text-xs">{d.section}</span>
                        </td>
                        <td className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
                          {periodLabel(d.periodId)}
                        </td>
                        <td className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
                          {d.uploadedAt ?? "—"}
                        </td>
                        <td>
                          <span className={`wf-chip ${statusChip(d.status)} text-xs`}>{d.status}</span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1 flex-wrap">
                            {(d.status === "Cargado" || d.status === "En revision") && (
                              <>
                                <button
                                  type="button"
                                  className="wf-action-btn"
                                  disabled={working}
                                  onClick={() => handleApprove(d)}
                                >
                                  Aprobar
                                </button>
                                <button
                                  type="button"
                                  className="wf-action-btn"
                                  disabled={working}
                                  onClick={() => { setSelected(d); setRejectReason(""); }}
                                >
                                  Rechazar…
                                </button>
                              </>
                            )}
                            {(d.status === "Aprobado" || d.status === "Rechazado") && (
                              <span className="text-xs italic" style={{ color: "var(--wf-text-muted)" }}>
                                Revisado
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Panel de detalle */}
        <div
          className="wf-card shrink-0"
          style={{ width: "300px", minHeight: "200px", position: "sticky", top: "16px" }}
        >
          {!selected ? (
            <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
              Selecciona un documento de la tabla para ver su detalle y validarlo.
            </p>
          ) : (
            <div className="space-y-3">
              <h2 className="text-sm font-bold border-b pb-2" style={{ borderColor: "var(--wf-border)" }}>
                Detalle del documento
              </h2>

              <dl className="text-sm space-y-1">
                <dt className="text-xs" style={{ color: "var(--wf-text-muted)" }}>Proveedor</dt>
                <dd className="font-medium">{supplierName(selected.supplierId)}</dd>

                <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Documento</dt>
                <dd className="font-medium">{selected.documentType}</dd>

                <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Sección</dt>
                <dd>{selected.section}</dd>

                <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Periodo</dt>
                <dd>{periodLabel(selected.periodId)}</dd>

                <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Archivo</dt>
                <dd className="text-xs font-mono">{selected.fileName ?? "Sin archivo"}</dd>

                <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Fecha carga</dt>
                <dd>{selected.uploadedAt ?? "—"}</dd>

                {selected.expiryDate && (
                  <>
                    <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Vencimiento</dt>
                    <dd>{selected.expiryDate}</dd>
                  </>
                )}

                <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Estatus</dt>
                <dd>
                  <span className={`wf-chip ${statusChip(selected.status)} text-xs`}>
                    {selected.status}
                  </span>
                </dd>

                {selected.validatorComment && (
                  <>
                    <dt className="text-xs mt-2" style={{ color: "var(--wf-text-muted)" }}>Comentario validador</dt>
                    <dd className="text-xs text-red-700">{selected.validatorComment}</dd>
                  </>
                )}
              </dl>

              {/* Vista previa placeholder */}
              <div
                className="flex items-center justify-center rounded text-xs"
                style={{
                  background: "var(--wf-bg-muted)",
                  border: "1px dashed var(--wf-border)",
                  height: "80px",
                  color: "var(--wf-text-muted)",
                }}
              >
                {selected.fileName ? `📄 ${selected.fileName}` : "Sin archivo adjunto"}
              </div>

              {/* Acciones */}
              {(selected.status === "Cargado" || selected.status === "En revision") && (
                <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--wf-border)" }}>
                  <button
                    type="button"
                    className="wf-btn wf-btn-primary w-full"
                    disabled={working}
                    onClick={() => handleApprove(selected)}
                  >
                    ✓ Aprobar documento
                  </button>

                  <div>
                    <label className="wf-label text-xs">Motivo de rechazo *</label>
                    <textarea
                      className="wf-input w-full text-sm"
                      rows={2}
                      placeholder="Describe el motivo…"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="wf-btn wf-btn-secondary w-full"
                    disabled={working || !rejectReason.trim()}
                    onClick={() => handleReject(selected)}
                  >
                    ✗ Rechazar documento
                  </button>
                </div>
              )}

              <button
                type="button"
                className="wf-btn wf-btn-secondary w-full text-xs"
                onClick={() => setSelected(null)}
              >
                Cerrar panel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
