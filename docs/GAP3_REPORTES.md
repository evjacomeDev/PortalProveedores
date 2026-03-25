# GAP 3 — Exportación de Reportes (Excel / Power BI)
## Portal de Proveedores EMPRESA · Sprint demo
**Stack:** React 19 · Vite · TypeScript · React Router v7 · Sonner · Tailwind CSS 4

---

## CONTEXTO

Repo `evjacomeDev/PortalProveedores`. Demo navegable con datos mock.
Convenciones:
- Estilos: clases `wf-*` de `src/styles/wireframe.css`
- Mock: `src/mock/db.ts` + `src/mock/api.ts`
- `toast.success/error()` de `sonner`
- **NO instalar dependencias adicionales** — el export se hace con el `exportCSV` existente

> ⚠️ **PREREQUISITO:** Este GAP asume que el GAP 1 y GAP 2 ya están aplicados.
> Si no, aplica estos mínimos antes de continuar:
> - `db.evaluationConfig` tiene `phaseLabels: { A: "Potencial", B: "Funcionamiento actual", C: "Capacidad estratégica" }`
> - `db.documentCatalog` existe con al menos secciones "Empresa" y "Tecnico"
> - `EvaluationVersion` tiene `nextReviewDate?: string`

---

## ESTADO ACTUAL

### `src/features/reports/ReportsPage.tsx`
```tsx
// Solo tiene 2 botones de export y tabla de bitácora:
<button onClick={() => exportCSV(compliance, "cumplimiento_proveedor.csv")}>
  Reporte cumplimiento (CSV)
</button>
<button onClick={() => exportCSV(overdue, "periodos_vencidos.csv")}>
  Periodos vencidos (CSV)
</button>
// + tabla de db.auditEvents
```

### `src/features/internal/RankingPage.tsx`
```tsx
// Botones sin implementar:
<button>Exportar (Excel)</button>  // ← no hace nada
<button>Reporte Power BI</button>  // ← no hace nada
```

### `src/mock/api.ts`
```typescript
export function exportCSV(rows: Record<string, unknown>[], fileName: string) {
  // Ya funciona — descarga CSV real con headers automáticos
}
// NO tiene funciones de export especializadas
```

---

## CAMBIOS REQUERIDOS

### PASO 1 — `src/mock/api.ts`

Agrega 4 funciones de export especializadas **después** de `exportCSV`:

```typescript
// ─── Export especializado: Ranking ────────────────────────────────────────────
export function exportRankingCSV() {
  const rows = db.suppliers
    .map((s) => {
      const evals = db.evaluations
        .filter((e) => e.supplierId === s.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = evals[0];
      const vencidos = db.periods.filter(
        (p) => p.supplierId === s.id && p.status === "Vencido"
      ).length;
      const docsPendientes = db.documents.filter(
        (d) => d.supplierId === s.id && d.status === "Pendiente"
      ).length;
      return {
        proveedor: s.name,
        tipo: s.type,
        estatus: s.status,
        score: latest?.finalScore?.toFixed(1) ?? "Sin eval",
        categoria: latest?.category ?? "—",
        proxima_evaluacion: latest?.nextReviewDate ?? "—",
        periodos_vencidos: vencidos,
        docs_pendientes: docsPendientes,
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map((r, i) => ({ rank: i + 1, ...r }));
  exportCSV(rows, "ranking_proveedores.csv");
}

// ─── Export especializado: Evaluación por fase ────────────────────────────────
export function exportEvaluationDetailCSV() {
  const cfg = db.evaluationConfig;
  const rows = db.evaluations.map((ev) => {
    const sup = db.suppliers.find((s) => s.id === ev.supplierId);
    const phaseScore = (dim: "A" | "B" | "C") => {
      const keys = cfg.criteria[dim].map((c) => `${dim}:${c}`);
      const sum = keys.reduce((acc, k) => acc + (ev.scores[k] ?? 0), 0);
      return ((sum / (keys.length * 5)) * 100).toFixed(1);
    };
    return {
      proveedor: sup?.name ?? ev.supplierId,
      fecha_evaluacion: ev.createdAt.slice(0, 10),
      score_total: ev.finalScore.toFixed(1),
      [`fase_${cfg.phaseLabels?.A ?? "A"}`]: phaseScore("A"),
      [`fase_${cfg.phaseLabels?.B ?? "B"}`]: phaseScore("B"),
      [`fase_${cfg.phaseLabels?.C ?? "C"}`]: phaseScore("C"),
      categoria: ev.category,
      proxima_evaluacion: ev.nextReviewDate ?? "—",
    };
  });
  exportCSV(rows, "evaluacion_por_fase_criterio.csv");
}

// ─── Export especializado: Estatus documental ─────────────────────────────────
export function exportDocumentStatusCSV() {
  const rows = db.documents.map((d) => {
    const sup = db.suppliers.find((s) => s.id === d.supplierId);
    const daysLeft = d.expiryDate
      ? Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000)
      : null;
    return {
      proveedor: sup?.name ?? d.supplierId,
      documento: d.documentType,
      seccion: d.section,
      estado: d.status,
      archivo: d.fileName ?? "—",
      fecha_carga: (d as any).uploadedAt ?? "—",
      fecha_vencimiento: d.expiryDate ?? "Sin vencimiento",
      dias_restantes: daysLeft !== null ? daysLeft : "N/A",
      alerta: daysLeft !== null && daysLeft < 30
        ? daysLeft < 0 ? "VENCIDO" : "PRÓXIMO A VENCER"
        : "",
    };
  });
  exportCSV(rows, "estatus_documental_vigencias.csv");
}

// ─── Export especializado: Historial de evaluaciones ─────────────────────────
export function exportEvaluationHistoryCSV() {
  const rows = db.evaluations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((ev) => {
      const sup = db.suppliers.find((s) => s.id === ev.supplierId);
      return {
        proveedor: sup?.name ?? ev.supplierId,
        tipo_proveedor: sup?.type ?? "—",
        fecha_evaluacion: ev.createdAt.slice(0, 10),
        score: ev.finalScore.toFixed(1),
        categoria: ev.category,
        proxima_evaluacion: ev.nextReviewDate ?? "—",
      };
    });
  exportCSV(rows, "historial_evaluaciones.csv");
}
```

### PASO 2 — `src/features/reports/ReportsPage.tsx`

Reescribe completamente:

```tsx
import { useState } from "react";
import { toast } from "sonner";
import {
  exportCSV,
  exportRankingCSV,
  exportEvaluationDetailCSV,
  exportDocumentStatusCSV,
  exportEvaluationHistoryCSV,
} from "../../mock/api";
import { db } from "../../mock/db";

// ── KPIs ────────────────────────────────────────────────────────────────────
function useKPIs() {
  const activeSuppliers = db.suppliers.filter((s) => s.status === "Activo");

  // % documentación al día: proveedores sin docs Pendiente o Rechazado
  const docsOk = activeSuppliers.filter(
    (s) => !db.documents.some(
      (d) => d.supplierId === s.id && (d.status === "Pendiente" || d.status === "Rechazado")
    )
  ).length;
  const pctDocsOk = activeSuppliers.length
    ? Math.round((docsOk / activeSuppliers.length) * 100)
    : 0;

  // Proveedores en riesgo (último score < 70)
  const enRiesgo = activeSuppliers.filter((s) => {
    const ev = db.evaluations
      .filter((e) => e.supplierId === s.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return ev && ev.finalScore < 70;
  }).length;

  // Documentos próximos a vencer (< 30 días)
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

  // Filtro bitácora
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
```

### PASO 3 — `src/features/internal/RankingPage.tsx`

Conecta los botones de export existentes:

1. Agrega import: `import { exportRankingCSV, exportEvaluationDetailCSV } from "../../mock/api";`
2. Reemplaza los dos botones sin función:
```tsx
<button type="button" className="wf-btn wf-btn-outline text-sm"
  onClick={exportRankingCSV}>
  Exportar (CSV / Excel)
</button>
<button type="button" className="wf-btn wf-btn-outline text-sm"
  onClick={() => { exportRankingCSV(); toast.success("CSV listo para importar en Power BI Desktop"); }}>
  Power BI
</button>
```
3. Agrega import de `toast` de `sonner` si no está.

---

## CRITERIO DE ACEPTACIÓN

1. Login `ag@demo.com` → `/app/reportes`
   - Se ven 4 KPI cards con números reales calculados desde `db`
   - Cada uno de los 6 reportes tiene botón "Exportar CSV" funcional que descarga archivo
   - "Descargar todos" descarga 6 archivos secuencialmente con toast final
   - Power BI card muestra instrucciones y botón funcional
   - Bitácora filtra por tipo de evento
2. `/app/ranking` → botones Exportar CSV y Power BI funcionan
3. `npx tsc --noEmit` sin errores
