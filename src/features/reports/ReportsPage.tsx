import { useState } from "react";
import { toast } from "sonner";
import {
  exportCSV,
  exportDocumentStatusCSV,
  exportEvaluationDetailCSV,
  exportEvaluationHistoryCSV,
  exportRankingCSV,
} from "../../mock/api";
import { db } from "../../mock/db";

// ── KPIs ────────────────────────────────────────────────────────────────────
function useKPIs() {
  const activeSuppliers = db.suppliers.filter((s) => s.status === "Activo");

  const docsOk = activeSuppliers.filter(
    (s) => !db.documents.some(
      (d) => d.supplierId === s.id && (d.status === "Pendiente" || d.status === "Rechazado")
    )
  ).length;
  const pctDocsOk = activeSuppliers.length
    ? Math.round((docsOk / activeSuppliers.length) * 100)
    : 0;

  const enRiesgo = activeSuppliers.filter((s) => {
    const ev = db.evaluations
      .filter((e) => e.supplierId === s.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return ev && ev.finalScore < 70;
  }).length;

  const proximosVencer = db.documents.filter((d) => {
    if (!d.expiryDate) return false;
    const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days < 30;
  }).length;

  return { total: activeSuppliers.length, pctDocsOk, enRiesgo, proximosVencer };
}

// ── Reportes disponibles ────────────────────────────────────────────────────
const REPORTS = [
  {
    id: "ranking",
    title: "Ranking de proveedores",
    desc: "Posición, score, categoría, próxima evaluación y alertas por proveedor.",
    columns: "rank · proveedor · tipo · score · categoría · próxima_evaluación · periodos_vencidos · docs_pendientes",
    fn: exportRankingCSV,
  },
  {
    id: "eval_fase",
    title: "Evaluación por fase y criterio",
    desc: "Score desglosado por las 3 fases de evaluación y categoría final.",
    columns: "proveedor · fecha · score_total · fase_Potencial · fase_Funcionamiento · fase_Capacidad · categoría",
    fn: exportEvaluationDetailCSV,
  },
  {
    id: "doc_status",
    title: "Estatus documental y vigencias",
    desc: "Estado de cada documento por proveedor con fechas de vencimiento y alertas.",
    columns: "proveedor · documento · sección · estado · fecha_carga · vencimiento · días_restantes · alerta",
    fn: exportDocumentStatusCSV,
  },
  {
    id: "eval_hist",
    title: "Historial de evaluaciones",
    desc: "Todas las versiones de evaluación por proveedor, cronológico descendente.",
    columns: "proveedor · tipo · fecha · score · categoría · próxima_evaluación",
    fn: exportEvaluationHistoryCSV,
  },
  {
    id: "compliance",
    title: "Cumplimiento REPSE por proveedor",
    desc: "Períodos aprobados por proveedor en módulo REPSE.",
    columns: "proveedor · periodos_aprobados",
    fn: () => {
      const rows = db.suppliers.map((s) => ({
        proveedor: s.name,
        periodos_aprobados: db.periods.filter(
          (p) => p.supplierId === s.id && p.status === "Aprobado"
        ).length,
      }));
      exportCSV(rows, "cumplimiento_repse.csv");
    },
  },
  {
    id: "overdue",
    title: "Períodos REPSE vencidos",
    desc: "Listado de todos los períodos con estatus Vencido.",
    columns: "periodo · contrato · proveedor",
    fn: () => {
      const rows = db.periods
        .filter((p) => p.status === "Vencido")
        .map((p) => ({
          periodo: p.label,
          contrato: p.contractId,
          proveedor: db.suppliers.find((s) => s.id === p.supplierId)?.name ?? p.supplierId,
        }));
      exportCSV(rows, "periodos_vencidos.csv");
    },
  },
];

async function downloadAll() {
  for (const r of REPORTS) {
    r.fn();
    await new Promise((res) => setTimeout(res, 400));
  }
  toast.success(`${REPORTS.length} reportes descargados`);
}

// ── Componente principal ────────────────────────────────────────────────────
export function ReportsPage() {
  const kpis = useKPIs();
  const [filterType, setFilterType] = useState("Todos");

  const eventTypes = ["Todos", ...new Set(db.auditEvents.map((e) => e.type))];
  const auditRows = db.auditEvents
    .filter((e) => filterType === "Todos" || e.type === filterType)
    .slice(0, 30);

  return (
    <>
      <h1 className="wf-page-title">Reportes y exportación</h1>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
        <div className="wf-card text-center">
          <p className="text-2xl font-bold">{kpis.total}</p>
          <p className="text-xs mt-1" style={{ color: "var(--wf-text-muted)" }}>Proveedores activos</p>
        </div>
        <div className="wf-card text-center">
          <p className="text-2xl font-bold">{kpis.pctDocsOk}%</p>
          <p className="text-xs mt-1" style={{ color: "var(--wf-text-muted)" }}>Documentación al día</p>
        </div>
        <div className="wf-card text-center">
          <p className="text-2xl font-bold" style={{ color: kpis.enRiesgo > 0 ? "#c00" : "inherit" }}>
            {kpis.enRiesgo}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--wf-text-muted)" }}>En riesgo (score &lt;70)</p>
        </div>
        <div className="wf-card text-center">
          <p className="text-2xl font-bold" style={{ color: kpis.proximosVencer > 0 ? "#c60" : "inherit" }}>
            {kpis.proximosVencer}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--wf-text-muted)" }}>Docs vencen en &lt;30 días</p>
        </div>
      </div>

      {/* ── Reportes disponibles ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-base font-bold">Reportes disponibles</h2>
        <button type="button" className="wf-btn wf-btn-primary text-sm" onClick={downloadAll}>
          ⬇ Descargar todos ({REPORTS.length} archivos)
        </button>
      </div>

      <div className="grid gap-4 mb-8">
        {REPORTS.map((r) => (
          <div key={r.id} className="wf-card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-bold text-sm">{r.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--wf-text-muted)" }}>{r.desc}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: "var(--wf-text-soft)" }}>
                Columnas: {r.columns}
              </p>
            </div>
            <button
              type="button"
              className="wf-btn wf-btn-outline text-sm shrink-0"
              onClick={() => { r.fn(); toast.success(`"${r.title}" descargado`); }}
            >
              Exportar CSV
            </button>
          </div>
        ))}
      </div>

      {/* ── Power BI ── */}
      <div className="wf-card mb-8 border-2 border-dashed" style={{ borderColor: "var(--wf-border)" }}>
        <h2 className="text-base font-bold mb-2">Integración Power BI</h2>
        <p className="text-sm mb-3" style={{ color: "var(--wf-text-muted)" }}>
          Importa los archivos CSV generados en Power BI Desktop usando{" "}
          <strong>Obtener datos → Texto/CSV</strong>. Todos los reportes están
          estructurados con headers compatibles para modelado directo.
        </p>
        <ol className="text-sm space-y-1 mb-4 list-decimal list-inside" style={{ color: "var(--wf-text-soft)" }}>
          <li>Descarga los reportes requeridos con el botón "Exportar CSV"</li>
          <li>Abre Power BI Desktop → Obtener datos → Texto/CSV</li>
          <li>Selecciona el archivo descargado y carga la tabla</li>
          <li>Repite para cada reporte que necesites modelar</li>
          <li>Crea relaciones entre tablas usando el campo <strong>proveedor</strong></li>
        </ol>
        <button
          type="button"
          className="wf-btn wf-btn-primary text-sm"
          onClick={downloadAll}
        >
          Descargar todos los reportes para Power BI
        </button>
      </div>

      {/* ── Bitácora ── */}
      <h2 className="mb-3 text-base font-bold">Bitácora / auditoría</h2>
      <div className="wf-filters mb-3">
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((t) => (
            <button key={t} type="button"
              className={`wf-btn ${filterType === t ? "wf-btn-primary" : "wf-btn-secondary"} text-xs`}
              onClick={() => setFilterType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap text-xs">
                    {new Date(e.createdAt).toLocaleString("es-MX")}
                  </td>
                  <td>
                    <span className="wf-chip wf-chip-preregistered text-xs">{e.type}</span>
                  </td>
                  <td className="text-sm">{e.message}</td>
                </tr>
              ))}
              {auditRows.length === 0 && (
                <tr><td colSpan={3} className="text-center py-4 text-sm"
                  style={{ color: "var(--wf-text-muted)" }}>Sin eventos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
