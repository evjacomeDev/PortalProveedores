# PROMPT MAESTRO — Claude Code
## Portal de Proveedores EMPRESA · Cierre de GAP para Demo
**Fecha:** 2026-03-24  
**Repositorio:** `evjacomeDev/PortalProveedores`  
**Stack:** React 19 · Vite · TypeScript · React Router v7 · Recharts · Zustand · Sonner · Tailwind CSS 4 · clsx · lucide-react

---

## CONTEXTO GENERAL

Estás trabajando en una **demo navegable** (datos mock, sin backend real) de un Portal de Proveedores para el cliente EMPRESA (Manufactura). El proyecto ya existe y tiene:

- Flujo REPSE funcional (periodos, expediente, validación documental)
- Sistema de login mock con roles (`AG`, `CO`, `CA`, `ID`, `FI`, `CS`, `PA`, `PU`)
- Layouts separados: interno (`AppShell`) y proveedor (`ProviderShell`)
- Datos en `src/mock/db.ts` y funciones async en `src/mock/api.ts`

El cliente emitió un **RFP** que exige funcionalidades adicionales. El objetivo de este sprint es cerrar los 4 GAPs prioritarios para la demo comercial. **No toques el flujo REPSE existente** — solo agrega y mejora.

---

## CONVENCIONES DEL PROYECTO (respétalas todas)

1. **Estilos:** usa exclusivamente las clases `wf-*` definidas en `src/styles/wireframe.css` e `src/index.css`. No uses Tailwind en línea para elementos que ya tengan clase `wf-*`. Para layouts menores usa Tailwind utilities.
2. **Mock data:** todos los datos van en `src/mock/db.ts`. Todas las operaciones async van en `src/mock/api.ts` con el patrón `await delay()` + `audit(type, message)`.
3. **Tipos:** todos los tipos nuevos van en `src/mock/types.ts`.
4. **Rutas:** nuevas rutas van en `src/app/routes.tsx`. Nuevas páginas van en `src/features/`.
5. **Exports:** cada nueva página/componente debe agregarse a `src/features/pages.ts`.
6. **Guards:** usa `<RequireRole roles={[...]} />` para proteger rutas por rol.
7. **Notificaciones:** usa `toast.success/error()` de `sonner` para feedback al usuario.
8. **No modifiques** `src/App.tsx` (está huérfano y en desuso).
9. **Nombrado:** PascalCase para componentes, camelCase para funciones, kebab-case para rutas.

---

## GAP 1 — EVALUACIÓN DE DESEMPEÑO (3 fases reales, fórmula RFP, semáforo visual)

### Problema actual
- `EvaluationConfigPage` muestra pesos A/B/C pero no es editable.
- `EvaluationCapturePage` tiene 3 pasos pero los nombres de fase no coinciden con el RFP ("Potencial", "Funcionamiento actual", "Capacidad estratégica").
- La fórmula de cálculo en `api.ts → createEvaluation` es correcta matemáticamente pero el nombre de las fases en `db.evaluationConfig` es `A`, `B`, `C` sin etiqueta de negocio.
- El semáforo de resultado solo aparece en el paso 4 de captura, no en la ficha del proveedor ni en el ranking.
- `EvaluationConfigPage` no es editable — los pesos y criterios están hardcodeados.
- El proveedor NO tiene vista de "Mi evaluación" con su score y categoría.

### Requerimientos del RFP a implementar
```
Fórmula: Calificación final (%) = Σ (Puntaje criterio × Peso criterio × Peso fase)
Resultado 0-100%. 3 fases: Potencial (A), Funcionamiento actual (B), Capacidad estratégica (C).
Categorías semáforo:
  ≥ 85%  → EXCELENTE        (verde oscuro / badge green)
  70-84% → CONFIABLE        (verde claro)
  60-69% → REGULAR          (amarillo)
  50-59% → EN DESARROLLO    (naranja)
  < 50%  → RIESGO ALTO      (rojo)
Frecuencia: anual automática. Si score < 70 → semestral.
Evaluación automática para todos los proveedores ACTIVOS.
```

### Cambios requeridos

#### `src/mock/types.ts`
Agrega campo `phaseLabel` al `EvaluationConfig`:
```typescript
export type EvaluationPhase = "A" | "B" | "C";

export type EvaluationConfig = {
  weights: Record<EvaluationPhase, number>;
  criteria: Record<EvaluationPhase, string[]>;
  phaseLabels: Record<EvaluationPhase, string>; // NUEVO
};

// Actualiza categorías para incluir las 5 nuevas
export type EvaluationVersion = {
  // ... existente ...
  category: "EXCELENTE" | "CONFIABLE" | "REGULAR" | "EN DESARROLLO" | "RIESGO ALTO";
  nextReviewDate?: string; // NUEVO - fecha próxima evaluación
};
```

#### `src/mock/db.ts`
Actualiza `evaluationConfig`:
```typescript
evaluationConfig: {
  weights: { A: 0.4, B: 0.35, C: 0.25 },
  phaseLabels: { A: "Potencial", B: "Funcionamiento actual", C: "Capacidad estratégica" },
  criteria: {
    A: ["Cumplimiento documental", "Tiempo de respuesta", "Solvencia económica"],
    B: ["Calidad de servicio", "Incidencias reportadas", "Cumplimiento de plazos"],
    C: ["Riesgo laboral", "Apego a procesos", "Capacidad de innovación"],
  },
}
```
Actualiza `evaluations` existentes para usar las nuevas categorías (reemplaza "APTO"→"CONFIABLE", "NO APTO"→"RIESGO ALTO", mantén "REGULAR", "EXCELENTE").
Agrega `nextReviewDate` a cada evaluación existente (si score < 70, date + 6 meses; si ≥ 70, date + 12 meses).

#### `src/mock/api.ts`
Actualiza `createEvaluation` para:
- Mapear categorías a las 5 nuevas (≥85 EXCELENTE, 70-84 CONFIABLE, 60-69 REGULAR, 50-59 EN DESARROLLO, <50 RIESGO ALTO)
- Calcular y guardar `nextReviewDate`

#### `src/features/evaluation/EvaluationConfigPage.tsx`
Reescribe completamente para mostrar:
- Tabla editable de pesos por fase (inputs numéricos, validación que sumen 1.0)
- Por cada fase: lista editable de criterios (add/remove/rename en demo)
- Botón "Guardar configuración" con `toast.success`
- Vista previa de la fórmula: `Calificación = (A_score × {pesoA}) + (B_score × {pesoB}) + (C_score × {pesoC})`
- Tabla de rangos de categoría (read-only, decorativa)

#### `src/features/evaluation/EvaluationCapturePage.tsx`
Actualiza para:
- Leer `phaseLabels` de `db.evaluationConfig` para mostrar nombre real de cada fase
- Breadcrumb con nombre del proveedor (busca en `db.suppliers` por `proveedorId`)
- En el resumen (paso 4): mostrar score con color según categoría, badge grande con categoría, y `nextReviewDate` calculada
- Tabla de puntaje desglosado por fase

#### `src/features/internal/RankingPage.tsx`
Completa la funcionalidad de exportación:
- El botón "Exportar (Excel)" debe llamar a `exportCSV(rankingRows, 'ranking_proveedores.csv')` con columnas: `#`, `proveedor`, `tipo`, `score`, `categoria`, `proxima_evaluacion`
- El botón "Reporte Power BI" debe mostrar un `toast.success("Archivo CSV listo para importar en Power BI")` y descargar el mismo CSV (en demo mock)
- Agrega columna "Próxima evaluación" en la tabla
- Muestra KPI resumen arriba de la tabla: total evaluados, % con score ≥ 70, # en riesgo

#### NUEVA: `src/features/provider/ProviderEvaluationPage.tsx` (ya existe, mejorar)
Verifica/reescribe para mostrar al proveedor:
- Score actual (número grande, semáforo de color)
- Badge de categoría
- Barra de progreso visual (0-100)
- Desglose por fase (A, B, C) con nombre real y puntaje
- Próxima fecha de evaluación
- Historial de evaluaciones previas (tabla: fecha, score, categoría)
- Si no tiene evaluación: mensaje "Tu evaluación está programada" con fecha estimada

#### `src/features/provider/ProviderEvaluationDetailPage.tsx` (ya existe, mejorar)
Muestra detalle criterio por criterio con score recibido y comentario del evaluador (usa datos mock).

---

## GAP 2 — DOCUMENTOS TÉCNICOS (Calidad / I+D) y categorización documental

### Problema actual
- `RepseDocument.section` tiene valores mezclados REPSE y no-REPSE
- No hay separación clara "Documentos de la Empresa" vs "Documentos Técnicos (Calidad/I+D)"
- `CatalogsPage` muestra una tabla demo no editable
- La vista del proveedor (`ProviderDocsPage`) no diferencia categorías documentales

### Requerimientos del RFP
```
Documentos de la Empresa:
  - Constancia de Situación Fiscal (vigencia: 3 meses)
  - Comprobante de domicilio fiscal (vigencia: 3 meses)
  - Contactos del proveedor
  - Información general (formato ADM-COM-F-009)
  - Carta bancaria / Estado de cuenta
  - Opinión de cumplimiento SAT (vigencia: 3 meses)
  - Acta constitutiva
  - Poder notarial representante legal
  - Identificación oficial representante legal

Documentos Técnicos (Calidad / I+D):
  - Certificaciones (FSSC 22000, BPM, ISO, HACCP, etc.)
  - Licencias aplicables
  - Fichas técnicas de productos/servicios
  - Requisitos del sistema de gestión de calidad

Formatos permitidos: PDF, Word (.docx), Excel (.xlsx)
Vigencias configurables por tipo de documento
```

### Cambios requeridos

#### `src/mock/types.ts`
Actualiza `RepseDocument.section`:
```typescript
export type DocumentSection =
  | "Alta"           // REPSE
  | "Vigencia"       // REPSE
  | "Mensual"        // REPSE
  | "Cuatrimestral"  // REPSE
  | "Empresa"        // NUEVO - documentos generales de la empresa
  | "Tecnico";       // NUEVO - calidad / I+D

export type RepseDocument = {
  // ... campos existentes ...
  section: DocumentSection;
  expiryDate?: string;    // NUEVO - fecha de vencimiento del documento
  daysUntilExpiry?: number; // NUEVO - calculado en UI
  allowedFormats?: string[]; // NUEVO - ej: ["PDF", "DOCX", "XLSX"]
};
```

Agrega nuevo tipo para catálogo configurable:
```typescript
export type DocumentCatalogItem = {
  id: string;
  name: string;
  section: DocumentSection;
  mandatory: boolean;
  validityDays: number;       // 0 = sin vencimiento; 90 = 3 meses
  allowedFormats: string[];   // ["PDF", "DOCX", "XLSX"]
  visibleToProvider: boolean;
  description?: string;
};
```

#### `src/mock/db.ts`
Agrega `documentCatalog: DocumentCatalogItem[]` con al menos 12 items:
- 9 documentos de empresa (listados en RFP)
- 4 documentos técnicos (certificaciones, licencias, fichas técnicas, requisitos SGC)
- Cada uno con `validityDays` apropiado (90 para CSF/opinión SAT/domicilio; 0 para acta constitutiva; 365 para certificaciones ISO)

Agrega 8-10 documentos mock en `db.documents` usando las nuevas secciones `"Empresa"` y `"Tecnico"` para los proveedores existentes (s1 a s6).

#### `src/features/catalogs/CatalogsPage.tsx`
Reescribe como catálogo funcional:
- Tabs: "Documentos Empresa" | "Documentos Técnicos" | "REPSE"
- Tabla con columnas: Documento, Obligatorio, Vigencia (días), Formatos, Visible proveedor, Acciones
- Botón "Nuevo documento" abre modal inline con campos: nombre, sección, obligatorio (toggle), vigencia días (input), formatos (checkboxes PDF/DOCX/XLSX), visible proveedor (toggle)
- Botón "Editar" por fila abre mismo modal pre-llenado
- Guarda en `db.documentCatalog` vía función en `api.ts`
- Botón "Exportar catálogo (CSV)"

#### `src/features/provider/ProviderDocsPage.tsx`
Reestructura con tabs:
- Tab "Mis documentos" → subtabs "De la Empresa" | "Técnicos" | "REPSE"
- Cada subtab muestra checklist de documentos del catálogo que aplican
- Estado de cada doc: Pendiente / Cargado / En revisión / Aprobado / Rechazado / Vencido
- Badge de advertencia si `daysUntilExpiry < 30`
- Botón "Subir" / "Reemplazar" por documento (mock: `toast.success("Documento cargado correctamente")`)
- Filtro por estado

#### `src/features/internal/InternalProveedorExpedientePage.tsx`
Agrega sección de documentos no-REPSE:
- Cards separados: "Documentos de la Empresa" y "Documentos Técnicos"
- Indicador de vencimiento próximo (días restantes, badge rojo si <15 días)
- Acción "Aprobar / Rechazar" con comentario (igual que flujo REPSE existente)

---

## GAP 3 — EXPORTACIÓN DE REPORTES (Excel real + Power BI-ready)

### Problema actual
- `ReportsPage` solo exporta 2 CSVs básicos (cumplimiento y periodos vencidos)
- `RankingPage` tiene botones de export que no funcionan
- No hay reporte de evaluación por fase y criterio
- No hay reporte de estatus documental y vigencias
- No hay historial de evaluaciones

### Requerimientos del RFP
```
Reportes requeridos:
1. Ranking de proveedores (score, categoría, próxima evaluación)
2. Resultados evaluación por fase y criterio (score por dimensión A/B/C)
3. Estatus documental y vigencias (por proveedor: docs vencidos/próximos)
4. Historial de evaluaciones (todas las versiones por proveedor)
5. Todos exportables en CSV compatible con Excel/Power BI
```

### Cambios requeridos

#### `src/mock/api.ts`
Agrega funciones de export especializadas:
```typescript
// Ya existe exportCSV — agregar estas helpers:

export function exportRankingReport() {
  // columnas: rank, nombre, tipo, score, categoria, proxima_eval, periodos_vencidos, docs_pendientes
}

export function exportEvaluationDetailReport() {
  // columnas: proveedor, fecha_eval, score_total, score_A, score_B, score_C, categoria
}

export function exportDocumentStatusReport() {
  // columnas: proveedor, documento, seccion, estado, fecha_vencimiento, dias_restantes
}

export function exportEvaluationHistoryReport() {
  // columnas: proveedor, fecha_eval, score, categoria, evaluador
}
```

#### `src/features/reports/ReportsPage.tsx`
Reestructura completamente:

**Sección 1 — KPIs rápidos (4 cards en grid):**
- Total proveedores activos
- % con documentación al día
- Proveedores en riesgo (score < 70)
- Documentos próximos a vencer (<30 días)

**Sección 2 — Tabla de reportes disponibles:**
Cada reporte en card con: título, descripción breve, columnas incluidas, botón "Exportar CSV" que llama a su función:

| Reporte | Función |
|---------|---------|
| Ranking de proveedores | `exportRankingReport()` |
| Evaluación por fase/criterio | `exportEvaluationDetailReport()` |
| Estatus documental y vigencias | `exportDocumentStatusReport()` |
| Historial de evaluaciones | `exportEvaluationHistoryReport()` |
| Cumplimiento REPSE | existente `exportCSV(compliance, ...)` |
| Periodos vencidos REPSE | existente `exportCSV(overdue, ...)` |

**Sección 3 — Power BI:**
Card con instrucciones mock:
- Texto: "Para conectar Power BI, importa los archivos CSV generados o usa la opción 'Obtener datos > CSV' en Power BI Desktop."
- Botón "Descargar todos los reportes (ZIP)" → mock: llama los 4 exports en secuencia con 500ms de delay entre cada uno + `toast.success("4 reportes descargados")`

**Sección 4 — Bitácora/auditoría** (como está actualmente, pero con filtro por tipo de evento)

---

## GAP 4 — RBAC MULTI-ÁREA (roles de negocio, menú dinámico, usuarios multi-área)

### Problema actual
- `AppShell` muestra el mismo menú a todos los internos; solo `validacion` y algunos módulos tienen guard por rol
- `roleMapping.ts` mapea técnico → negocio pero el menú no lo usa
- `UsersPage` muestra la tabla pero el botón "Editar" no hace nada
- No existe el concepto de "usuario multi-área" ni "admin de área"
- Los roles de negocio del RFP (Admin Global, Admin Área, Evaluador, Consulta) no se reflejan en el menú

### Requerimientos del RFP
```
Jerarquía de roles:
- Administrador Global (AG): acceso total, gestión de usuarios, configuración
- Administrador por Área (CO): gestiona usuarios de su área, no configuración global
- Evaluador (CA, ID, FI): ejecuta evaluaciones de su área, ve documentos
- Usuario de Consulta (CS): solo lectura de reportes y ranking
- Proveedor (PA, PU): su propio portal

Usuarios multi-área: un usuario puede tener múltiples roles de área
Menú dinámico: cada rol ve solo lo que le corresponde
```

### Cambios requeridos

#### `src/mock/types.ts`
```typescript
// Agrega areas al User:
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;           // rol principal
  areas?: string[];     // NUEVO: ["Compras", "Calidad"] - multi-área
  status: "Activo" | "Inactivo";
  supplierId?: string;
  lastLogin?: string;   // NUEVO
};
```

#### `src/mock/db.ts`
Actualiza usuarios con `areas`:
```
AG  → Admin Global → areas: ["Administración"]
CO  → Evaluador Compras → areas: ["Compras"]
CA  → Evaluador Calidad → areas: ["Calidad"]
ID  → Evaluador I+D → areas: ["I+D"]  
FI  → Evaluador Finanzas → areas: ["Finanzas"]
CS  → Consulta General → areas: []
```
Agrega 2 usuarios de ejemplo multi-área:
- `u8`: "Gerente Compras-Calidad", role: "CO", areas: ["Compras", "Calidad"]
- `u9`: "Analista Compras-Finanzas", role: "CO", areas: ["Compras", "Finanzas"]

#### `src/app/roleMapping.ts`
Agrega función para obtener menú permitido:
```typescript
export type MenuItem = {
  label: string;
  path: string;
  icon?: string;
};

export function getAllowedMenuItems(role: Role): MenuItem[] {
  // AG: dashboard, proveedores, validacion, evaluacion, ranking, planes-mejora,
  //     reportes, config/documentos, admin/usuarios, admin/biblioteca
  // CO: dashboard, proveedores, evaluacion, ranking, planes-mejora, reportes
  // CA/ID/FI: dashboard, proveedores, validacion, evaluacion, ranking, planes-mejora
  // CS: dashboard, proveedores, reportes, ranking
}
```

#### `src/app/layout/AppShell.tsx`
Actualiza el sidebar para:
- Leer el usuario actual de Zustand store
- Llamar `getAllowedMenuItems(user.role)` para renderizar solo los ítems permitidos
- Mostrar nombre del usuario + badge de su rol de negocio (ej: "Admin Global") en el header del sidebar
- Mostrar áreas del usuario como chips pequeños bajo el nombre

#### `src/features/users/UsersPage.tsx`
Mejora completa:
- Tabla existente + columna "Áreas" que muestra chips de `user.areas`
- Botón "Nuevo usuario" funcional: modal con campos nombre, email, rol (select), áreas (multi-select checkboxes: Compras, Calidad, I+D, Finanzas, Administración), contraseña mock
- Botón "Editar" funcional: mismo modal pre-llenado
- Botón "Desactivar/Activar" que cambia `status` en `db.users`
- Filtro por rol y por área
- Todos los cambios con `toast.success` y entrada en `db.auditEvents`
- Implementa funciones `createUser`, `updateUser`, `toggleUserStatus` en `src/mock/api.ts`

---

## TAREAS TRANSVERSALES (aplica en todos los GAPs)

### Terminología
Reemplaza en todos los títulos y copy donde se lea "Portal REPSE" por "Portal de Proveedores". Solo mantén "REPSE" en el módulo de operación REPSE (`/proveedor/operacion/*` y `/app/expediente/*`).

### Menú proveedor (`ProviderShell.tsx`)
Verifica que el menú horizontal del proveedor incluya todos estos ítems:
- Inicio (`/proveedor/home`)
- Mis documentos (`/proveedor/documentos`)
- Mi evaluación (`/proveedor/evaluacion`)
- Mis planes de mejora (`/proveedor/planes`)
- Biblioteca (`/proveedor/biblioteca`)
- Facturación (`/proveedor/facturacion`)
- Operación REPSE (`/proveedor/operacion/contratos`) — solo si el proveedor tiene contratos REPSE

### Dashboard interno (`DashboardPage.tsx`)
Agrega/actualiza los KPIs para incluir:
- Proveedores evaluados este período vs total activos
- Score promedio de la cartera
- # proveedores con documentos vencidos
- # proveedores en riesgo (score < 70)

Estos KPIs deben calcularse desde `db` en tiempo de render.

---

## ORDEN DE IMPLEMENTACIÓN SUGERIDO

1. **`types.ts`** — todos los cambios de tipos primero (sin esto los demás fallan TypeScript)
2. **`db.ts`** — seed data actualizado
3. **`api.ts`** — funciones nuevas de evaluación y export
4. **`roleMapping.ts`** — `getAllowedMenuItems`
5. **`AppShell.tsx`** — menú dinámico
6. **`UsersPage.tsx`** — RBAC visible
7. **`EvaluationConfigPage.tsx`** — config editable
8. **`EvaluationCapturePage.tsx`** — fases con nombres reales
9. **`ProviderEvaluationPage.tsx`** + **`ProviderEvaluationDetailPage.tsx`** — vista proveedor
10. **`RankingPage.tsx`** — export funcional
11. **`CatalogsPage.tsx`** — catálogo editable
12. **`ProviderDocsPage.tsx`** — tabs empresa/técnico/REPSE
13. **`ReportsPage.tsx`** — 6 reportes + Power BI
14. **`DashboardPage.tsx`** — KPIs actualizados
15. **`ProviderShell.tsx`** — menú completo

---

## CRITERIOS DE ACEPTACIÓN DE LA DEMO

Al terminar debe ser posible hacer este recorrido sin errores:

### Recorrido 1 — Evaluador interno (login: `calidad@demo.com`)
1. Login → Dashboard con KPIs de evaluación visibles
2. Proveedores → seleccionar "Servicios Alpha" → Ver ficha
3. Desde ficha → "Evaluar" → completar 3 fases → ver resumen con score y badge
4. Ranking → ver tabla con scores, filtrar por "Servicios", exportar CSV
5. Reportes → descargar "Evaluación por fase"

### Recorrido 2 — Proveedor (login: `pa@demo.com`)
1. Login → Home con resumen de obligaciones
2. Mis documentos → Tab "De la Empresa" → ver estado de cada doc, badge de vencimiento
3. Mi evaluación → ver score actual, categoría, desglose por fase, próxima evaluación

### Recorrido 3 — Admin Global (login: `ag@demo.com`)
1. Login → Dashboard completo
2. Admin → Usuarios → crear usuario multi-área, editar existente
3. Config → Documentos → agregar nuevo documento técnico
4. Reportes → exportar todos los reportes

---

## NOTAS FINALES PARA CLAUDE CODE

- **No instales dependencias adicionales** a menos que sea absolutamente necesario. Para export Excel usa el `exportCSV` existente (CSV es compatible con Excel y Power BI).
- Si necesitas un modal simple usa un `<div>` con `position: fixed` y clases `wf-*`, no instales una librería de modales.
- Mantén todos los archivos TypeScript sin errores (`tsc --noEmit` debe pasar).
- Cada archivo modificado debe compilar de manera aislada.
- Los componentes deben funcionar con los datos seed existentes en `db.ts` sin requerir interacción previa del usuario.
- Para la demo del cliente, prioriza que **todo sea clickeable y muestre datos** — prefiere un mock coherente a una funcionalidad incompleta.
