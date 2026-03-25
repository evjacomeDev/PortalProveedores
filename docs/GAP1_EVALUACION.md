# GAP 1 — Evaluación de Desempeño (3 fases, fórmula RFP, semáforo, export)
## Portal de Proveedores EMPRESA · Sprint demo
**Stack:** React 19 · Vite · TypeScript · React Router v7 · Recharts · Zustand · Sonner · Tailwind CSS 4

---

## CONTEXTO

Estás en el repo `evjacomeDev/PortalProveedores`. Es una **demo navegable** con datos mock (sin backend).
Convenciones obligatorias:
- Estilos: solo clases `wf-*` de `src/styles/wireframe.css` + Tailwind utilities para layout
- Mock data: `src/mock/db.ts` | Operaciones async: `src/mock/api.ts` con `await delay()` + `audit()`
- Tipos: `src/mock/types.ts` | Notificaciones: `toast.success/error()` de `sonner`
- Nuevas páginas exportadas desde `src/features/pages.ts`
- NO modificar `src/App.tsx` (huérfano)

---

## ESTADO ACTUAL (lo que YA existe)

### `src/mock/types.ts` — tipos relevantes existentes
```typescript
export type EvaluationConfig = {
  weights: { A: number; B: number; C: number };
  criteria: Record<"A" | "B" | "C", string[]>;
  // ← NO tiene phaseLabels ni categorías de negocio
};

export type EvaluationVersion = {
  id: string;
  supplierId: string;
  createdAt: string;
  scores: Record<string, number>;
  finalScore: number;
  category: "APTO" | "EN DESARROLLO" | "NO APTO" | "CONFIABLE" | "REGULAR" | "RIESGO ALTO" | "EXCELENTE";
  // ← NO tiene nextReviewDate
};
```

### `src/mock/db.ts` — seed actual
```typescript
evaluationConfig: {
  weights: { A: 0.4, B: 0.3, C: 0.3 },
  criteria: {
    A: ["Cumplimiento documental", "Tiempo de respuesta"],
    B: ["Calidad de servicio", "Incidencias"],
    C: ["Riesgo laboral", "Apego a procesos"],
  },
},
evaluations: [
  { id: "ev_seed_s1", supplierId: "s1", createdAt: "2026-02-15T10:00:00.000Z",
    scores: { "A:Cumplimiento documental": 4, "A:Tiempo de respuesta": 4,
              "B:Calidad de servicio": 3, "B:Incidencias": 4,
              "C:Riesgo laboral": 4, "C:Apego a procesos": 3 },
    finalScore: 82.5, category: "CONFIABLE" },
  // + ev_old_s1 (68.0), ev_seed_s2 (75.0), ev_seed_s3 (48.0), ev_seed_s5 (92.0)
]
```

### `src/mock/api.ts` — función existente
```typescript
export async function createEvaluation(supplierId: string, scores: Record<string, number>) {
  // Calcula finalScore correctamente via pesos A/B/C
  // Categorías actuales: "APTO" ≥80, "EN DESARROLLO" ≥60, "NO APTO" <60
  // ← NECESITA actualizar categorías a las 5 nuevas
}

export function exportCSV(rows: Record<string, unknown>[], fileName: string) {
  // Ya existe y funciona — descarga CSV real
}
```

### Páginas existentes (ya en `routes.tsx` y `pages.ts`)
- `/app/evaluacion` → `EvaluationConfigPage` — muestra pesos A/B/C pero NO es editable
- `/app/evaluacion/:proveedorId` → `EvaluationCapturePage` — wizard 3 pasos + resumen, pero fases nombradas "Fase 1/2/3" sin nombre de negocio
- `/app/ranking` → `RankingPage` — tabla funcional, botones export SIN implementar
- `/proveedor/evaluacion` → `ProviderEvaluationPage` — muestra score y badge básico
- `/proveedor/evaluacion/detalle` → `ProviderEvaluationDetailPage` — muestra criterios por fase

---

## CAMBIOS REQUERIDOS

### PASO 1 — `src/mock/types.ts`

Agrega `phaseLabels` a `EvaluationConfig` y `nextReviewDate` a `EvaluationVersion`:

```typescript
export type EvaluationPhase = "A" | "B" | "C";

export type EvaluationConfig = {
  weights: Record<EvaluationPhase, number>;
  phaseLabels: Record<EvaluationPhase, string>;   // NUEVO
  criteria: Record<EvaluationPhase, string[]>;
};

export type EvaluationCategory =
  | "EXCELENTE"       // ≥ 85
  | "CONFIABLE"       // 70–84
  | "REGULAR"         // 60–69
  | "EN DESARROLLO"   // 50–59
  | "RIESGO ALTO";    // < 50

export type EvaluationVersion = {
  id: string;
  supplierId: string;
  createdAt: string;
  scores: Record<string, number>;
  finalScore: number;
  category: EvaluationCategory;
  nextReviewDate: string;   // NUEVO — ISO date string
};
```

### PASO 2 — `src/mock/db.ts`

Actualiza `evaluationConfig` y corrige `evaluations` existentes:

```typescript
evaluationConfig: {
  weights: { A: 0.40, B: 0.35, C: 0.25 },
  phaseLabels: {
    A: "Potencial",
    B: "Funcionamiento actual",
    C: "Capacidad estratégica",
  },
  criteria: {
    A: ["Cumplimiento documental", "Tiempo de respuesta", "Solvencia económica"],
    B: ["Calidad de servicio", "Incidencias reportadas", "Cumplimiento de plazos"],
    C: ["Riesgo laboral", "Apego a procesos", "Capacidad de innovación"],
  },
},
```

Actualiza las `evaluations` existentes para añadir `nextReviewDate`:
- Si `finalScore < 70` → `nextReviewDate` = createdAt + 6 meses
- Si `finalScore >= 70` → `nextReviewDate` = createdAt + 12 meses
- Actualiza las categorías: "APTO" → "CONFIABLE", "NO APTO" → "RIESGO ALTO"
- Actualiza scores en `evaluations` para que sus keys coincidan con los nuevos criterios (3 por fase). Recalcula `finalScore` con los nuevos pesos y nuevos criterios.

> ⚠️ Las evaluations existentes tienen 2 criterios por fase (ej `"A:Cumplimiento documental"`, `"A:Tiempo de respuesta"`). Con los nuevos 3 criterios por fase, agrega el tercer criterio con un valor razonable (ej: 3 o 4) para mantener coherencia. El id, supplierId y createdAt no cambian.

### PASO 3 — `src/mock/api.ts`

Crea función helper privada y actualiza `createEvaluation`:

```typescript
// Helper privado — exporta si otros módulos la necesitan
function scoreToCategory(score: number): EvaluationCategory {
  if (score >= 85) return "EXCELENTE";
  if (score >= 70) return "CONFIABLE";
  if (score >= 60) return "REGULAR";
  if (score >= 50) return "EN DESARROLLO";
  return "RIESGO ALTO";
}

function nextReviewDateFrom(createdAt: string, score: number): string {
  const d = new Date(createdAt);
  d.setMonth(d.getMonth() + (score < 70 ? 6 : 12));
  return d.toISOString().slice(0, 10);
}

// Actualiza createEvaluation:
export async function createEvaluation(supplierId: string, scores: Record<string, number>) {
  await delay();
  const cfg = db.evaluationConfig;
  const grouped = { A: 0, B: 0, C: 0 } as Record<EvaluationPhase, number>;
  Object.entries(scores).forEach(([key, value]) => {
    const dim = key.split(":")[0] as EvaluationPhase;
    grouped[dim] += value;
  });
  const percentages = {
    A: Math.min(100, (grouped.A / (cfg.criteria.A.length * 5)) * 100),
    B: Math.min(100, (grouped.B / (cfg.criteria.B.length * 5)) * 100),
    C: Math.min(100, (grouped.C / (cfg.criteria.C.length * 5)) * 100),
  };
  const finalScore =
    percentages.A * cfg.weights.A +
    percentages.B * cfg.weights.B +
    percentages.C * cfg.weights.C;
  const createdAt = new Date().toISOString();
  const version: EvaluationVersion = {
    id: id("eval"),
    supplierId,
    createdAt,
    scores,
    finalScore,
    category: scoreToCategory(finalScore),
    nextReviewDate: nextReviewDateFrom(createdAt, finalScore),
  };
  db.evaluations.unshift(version);
  audit("evaluation", `Evaluacion ${supplierId}: ${finalScore.toFixed(1)} (${version.category})`);
  return version;
}
```

Agrega función de export para ranking:

```typescript
export function exportRankingCSV() {
  const rows = db.suppliers
    .map((s) => {
      const ev = db.evaluations
        .filter((e) => e.supplierId === s.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      return {
        proveedor: s.name,
        tipo: s.type,
        score: ev?.finalScore?.toFixed(1) ?? "—",
        categoria: ev?.category ?? "Sin evaluación",
        proxima_evaluacion: ev?.nextReviewDate ?? "—",
        estatus: s.status,
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map((r, i) => ({ rank: i + 1, ...r }));
  exportCSV(rows, "ranking_proveedores.csv");
}

export function exportEvaluationDetailCSV() {
  const rows = db.evaluations.map((ev) => {
    const sup = db.suppliers.find((s) => s.id === ev.supplierId);
    const cfg = db.evaluationConfig;
    const phaseScores: Record<string, number> = { A: 0, B: 0, C: 0 };
    Object.entries(ev.scores).forEach(([key, val]) => {
      const dim = key.split(":")[0];
      phaseScores[dim] = (phaseScores[dim] ?? 0) + val;
    });
    return {
      proveedor: sup?.name ?? ev.supplierId,
      fecha: ev.createdAt.slice(0, 10),
      score_total: ev.finalScore.toFixed(1),
      [`score_${cfg.phaseLabels.A}`]: ((phaseScores.A / (cfg.criteria.A.length * 5)) * 100).toFixed(1),
      [`score_${cfg.phaseLabels.B}`]: ((phaseScores.B / (cfg.criteria.B.length * 5)) * 100).toFixed(1),
      [`score_${cfg.phaseLabels.C}`]: ((phaseScores.C / (cfg.criteria.C.length * 5)) * 100).toFixed(1),
      categoria: ev.category,
    };
  });
  exportCSV(rows, "evaluacion_por_fase.csv");
}
```

### PASO 4 — `src/features/evaluation/EvaluationConfigPage.tsx`

Reescribe completamente:

```tsx
import { useState } from "react";
import { toast } from "sonner";
import { db } from "../../mock/db";

const CATEGORY_RANGES = [
  { label: "EXCELENTE", min: 85, max: 100, chip: "wf-chip-active" },
  { label: "CONFIABLE", min: 70, max: 84, chip: "wf-chip-active" },
  { label: "REGULAR", min: 60, max: 69, chip: "wf-chip-validating" },
  { label: "EN DESARROLLO", min: 50, max: 59, chip: "wf-chip-preregistered" },
  { label: "RIESGO ALTO", min: 0, max: 49, chip: "wf-chip-blocked" },
];

export function EvaluationConfigPage() {
  const [weights, setWeights] = useState({ ...db.evaluationConfig.weights });
  const [labels, setLabels] = useState({ ...db.evaluationConfig.phaseLabels });
  const [criteria, setCriteria] = useState({
    A: [...db.evaluationConfig.criteria.A],
    B: [...db.evaluationConfig.criteria.B],
    C: [...db.evaluationConfig.criteria.C],
  });

  const total = +(weights.A + weights.B + weights.C).toFixed(2);
  const isValid = total === 1.0;

  function save() {
    if (!isValid) { toast.error("Los pesos deben sumar exactamente 1.0"); return; }
    db.evaluationConfig.weights = { ...weights };
    db.evaluationConfig.phaseLabels = { ...labels };
    db.evaluationConfig.criteria = {
      A: [...criteria.A], B: [...criteria.B], C: [...criteria.C],
    };
    toast.success("Configuración de evaluación guardada");
  }

  return (
    <>
      <h1 className="wf-page-title">Configuración de evaluación</h1>

      {/* Fórmula visual */}
      <div className="wf-card mb-6 bg-[#f8f8f8]">
        <p className="text-xs font-bold mb-1" style={{ color: "var(--wf-text-muted)" }}>
          Fórmula
        </p>
        <p className="text-sm font-mono">
          Calificación (%) = ({labels.A} × {weights.A}) + ({labels.B} × {weights.B}) + ({labels.C} × {weights.C})
        </p>
        <p className={`mt-2 text-xs font-bold ${isValid ? "text-green-700" : "text-red-600"}`}>
          Suma pesos: {total} {isValid ? "✓" : "← debe ser 1.0"}
        </p>
      </div>

      {/* Pesos y criterios por fase */}
      {(["A", "B", "C"] as const).map((dim) => (
        <div key={dim} className="wf-card mb-4">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h2 className="font-bold text-sm">Fase {dim}</h2>
            <input
              className="wf-input w-32 text-sm"
              placeholder={`Nombre fase ${dim}`}
              value={labels[dim]}
              onChange={(e) => setLabels((l) => ({ ...l, [dim]: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--wf-text-muted)" }}>Peso:</label>
              <input
                type="number" min={0} max={1} step={0.05}
                className="wf-input w-20 text-center text-sm"
                value={weights[dim]}
                onChange={(e) => setWeights((w) => ({ ...w, [dim]: +e.target.value }))}
              />
            </div>
          </div>
          <ul className="space-y-1">
            {criteria[dim].map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  className="wf-input flex-1 text-sm"
                  value={c}
                  onChange={(e) => {
                    const next = [...criteria[dim]];
                    next[i] = e.target.value;
                    setCriteria((cr) => ({ ...cr, [dim]: next }));
                  }}
                />
                <button
                  type="button" className="wf-action-btn text-xs"
                  onClick={() => setCriteria((cr) => ({ ...cr, [dim]: cr[dim].filter((_, j) => j !== i) }))}
                >Eliminar</button>
              </li>
            ))}
          </ul>
          <button
            type="button" className="wf-btn wf-btn-secondary text-xs mt-2"
            onClick={() => setCriteria((cr) => ({ ...cr, [dim]: [...cr[dim], "Nuevo criterio"] }))}
          >+ Agregar criterio</button>
        </div>
      ))}

      <button type="button" className="wf-btn wf-btn-primary mb-8" onClick={save}>
        Guardar configuración
      </button>

      {/* Tabla de categorías (read-only) */}
      <h2 className="text-base font-bold mb-3">Tabla de categorías</h2>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead><tr><th>Categoría</th><th>Rango (%)</th></tr></thead>
            <tbody>
              {CATEGORY_RANGES.map((r) => (
                <tr key={r.label}>
                  <td><span className={`wf-chip ${r.chip}`}>{r.label}</span></td>
                  <td>{r.min}% – {r.max}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
```

### PASO 5 — `src/features/evaluation/EvaluationCapturePage.tsx`

Actualiza para usar `phaseLabels` del config y mostrar datos ricos en el resumen. Modifica las partes relevantes:

1. **Nombres de fase:** reemplaza los strings hardcodeados `"Fase 1: Potencial"`, etc. por:
   ```typescript
   const phaseLabels = db.evaluationConfig.phaseLabels;
   // ...
   const stepTitle = step === 1
     ? `Fase 1: ${phaseLabels.A}`
     : step === 2
       ? `Fase 2: ${phaseLabels.B}`
       : `Fase 3: ${phaseLabels.C}`;
   ```

2. **Nombre del proveedor en breadcrumb:**
   ```typescript
   const supplier = db.suppliers.find((s) => s.id === proveedorId);
   // breadcrumb: Evaluación / <nombre> / Captura
   ```

3. **Resumen paso 4** — reemplaza el bloque actual por:
   ```tsx
   // Calcula scores por fase para mostrar desglose
   const cfg = db.evaluationConfig;
   const phaseResults = (["A", "B", "C"] as const).map((dim) => {
     const dimCriteria = cfg.criteria[dim].map((c) => `${dim}:${c}`);
     const sum = dimCriteria.reduce((acc, key) => acc + (scores[key] ?? 0), 0);
     const pct = (sum / (dimCriteria.length * 5)) * 100;
     return { dim, label: cfg.phaseLabels[dim], pct, weight: cfg.weights[dim] };
   });
   const finalScore = phaseResults.reduce((acc, p) => acc + p.pct * p.weight, 0);
   const category = /* misma lógica 5 categorías */;
   const nextReview = /* date + 6 o 12 meses */;

   // UI del resumen:
   // - Score grande centrado con color semáforo
   // - Badge de categoría
   // - Tabla de desglose por fase: Fase | Score % | Peso | Contribución
   // - "Próxima evaluación: " + nextReview
   ```

### PASO 6 — `src/features/internal/RankingPage.tsx`

Implementa los botones de export y agrega KPIs:

1. Importa `exportRankingCSV` y `exportEvaluationDetailCSV` de `../../mock/api`
2. Reemplaza los botones de export:
   ```tsx
   <button type="button" className="wf-btn wf-btn-outline text-sm"
     onClick={exportRankingCSV}>
     Exportar (CSV / Excel)
   </button>
   <button type="button" className="wf-btn wf-btn-outline text-sm"
     onClick={() => { exportRankingCSV(); toast.success("CSV listo para importar en Power BI"); }}>
     Power BI
   </button>
   ```
3. Agrega columna "Próxima eval." en la tabla (usa `ev?.nextReviewDate ?? "—"`)
4. Agrega 3 KPI cards **arriba** de la tabla (en un `div` grid de 3 columnas):
   - **Evaluados:** `db.evaluations.filter` unique supplierIds vs total suppliers
   - **Score promedio:** promedio de `finalScore` de la última evaluación por proveedor
   - **En riesgo:** count de proveedores con último score < 70

### PASO 7 — `src/features/provider/ProviderEvaluationPage.tsx`

Reescribe para mostrar experiencia completa al proveedor:

```tsx
// Muestra:
// 1. Score actual como número grande con color de semáforo (rojo/amarillo/verde)
// 2. Barra de progreso visual (0-100) — usa un div con width: `${score}%`
// 3. Badge de categoría (EXCELENTE/CONFIABLE/REGULAR/EN DESARROLLO/RIESGO ALTO)
// 4. Tabla de desglose por fase: Fase | Score fase % | Peso | Criterios evaluados
// 5. "Próxima evaluación: " + nextReviewDate con nota "anual / semestral si score < 70"
// 6. Tabla historial: Fecha | Score | Categoría
// 7. Si no hay evaluación: card con mensaje "Tu evaluación está programada.
//    Serás notificado cuando esté disponible."

// Usa db.evaluationConfig.phaseLabels para nombres de fase
// Usa colores semáforo correctos para las 5 categorías:
//   EXCELENTE → wf-chip-active (verde oscuro)
//   CONFIABLE → wf-chip-active
//   REGULAR → wf-chip-validating (amarillo)
//   EN DESARROLLO → wf-chip-preregistered (naranja/gris)
//   RIESGO ALTO → wf-chip-blocked (rojo)
```

### PASO 8 — `src/features/provider/ProviderEvaluationDetailPage.tsx`

Actualiza para leer `phaseLabels` del config (en lugar de tenerlos hardcodeados):
```typescript
// Reemplaza el array fases hardcodeado por:
const cfg = db.evaluationConfig;
const fases = (["A", "B", "C"] as const).map((id) => ({
  id,
  nombre: cfg.phaseLabels[id],
  criteria: cfg.criteria[id],
}));
```
Muestra también el score por criterio como porcentaje (valor/5 × 100) además del `v/5`.

---

## CRITERIO DE ACEPTACIÓN

Flujo demostrable sin errores:
1. Login `ag@demo.com` → `/app/evaluacion` → pesos editables, guardar OK
2. `/app/proveedores` → "Servicios Alpha" → "Evaluar" → 3 fases con nombres reales → resumen con score + badge + desglose → Confirmar
3. `/app/ranking` → tabla con scores + próxima eval + 3 KPIs → Exportar CSV descarga archivo
4. Login `pa@demo.com` → `/proveedor/evaluacion` → score + barra + desglose + próxima fecha
5. TypeScript sin errores: `npx tsc --noEmit`
