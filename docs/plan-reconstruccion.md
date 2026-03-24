# Plan de reconstrucción por fases — Demo Portal Proveedores EMPRESA

**Fecha:** 2026-03-24  
**Basado en:** `auditoria-demo-actual.md`, `matriz-cobertura-actual.md`, `requerimientos-portal-empresa.md` §11, `guion-demo-cliente.md`  
**Nota:** Este plan **no** sustituye los entregables detallados de la Fase 2 (`sitemap-demo.md`, `flujos-demo.md`, `rutas-propuestas.md`); los anticipa a alto nivel.

---

## 1. Principios rectores

1. **Fuente de verdad funcional:** `requerimientos-portal-empresa.md`.
2. **Storytelling y orden de demo:** `guion-demo-cliente.md` (landing → potencial → activo → interno → admin).
3. **Reutilizar** login, shells, listados, ficha, expediente, validación, evaluación, catálogos, usuarios, reportes **adaptando** copy, rutas y menús.
4. **No arrastrar** la narrativa REPSE cuando impida el flujo “portal general”; mantener contratos/periodos como **subflujo mock** si aportan densidad operativa.
5. Priorizar **navegación por rol**, **journeys completos** y **mock coherente** sobre perfección visual.

---

## 2. Estrategia global (antes del código masivo)

| Paso | Acción | Entregable / fase docs |
|------|--------|-------------------------|
| A | Congelar diagnóstico | ✅ Fase 1 (`auditoria-demo-actual.md`, `matriz-cobertura-actual.md`, este plan). |
| B | Diseñar sitemap y rutas por rol | Fase 2: `sitemap-demo.md`, `flujos-demo.md`, `rutas-propuestas.md`. |
| C | Validar arquitectura vs req. | Fase 2 (prompt 3): `validacion-arquitectura.md`. |
| D | Implementar navegación y layouts | Fase 3: prompts 4–5 + `rutas-implementadas.md`. |
| E | Módulos funcionales y mock central | Fases 4–5: prompts 6–10 + `modelo-mock-demo.md`. |
| F | Readiness comercial y cobertura final | Fase 5: `demo-readiness-check.md`, `matriz-cobertura-final.md`, `gaps-finales.md`, `guion-demo-presentacion-final.md`. |

---

## 3. Fases de implementación sugeridas (alineadas a prioridades del req. §11)

### Fase A — Núcleo de entrada y roles (Prioridad alta — base UX)

**Objetivo:** Que el cliente vea tres puertas: público, proveedor, interno.

- Añadir **landing pública** con CTAs “Soy proveedor” y “Quiero ser proveedor” (FR-01–04).
- Separar rutas de auth: p. ej. `/login/proveedor` y `/login/empresa` o query/modo claro desde landing; mantener mock simple.
- Ajustar redirección `*` para no obligar siempre a login si hay rutas públicas.
- Definir **layouts**: `PublicLayout`, reutilizar `AuthShell`, `ProviderShell`, `AppShell` (o `InternalShell`) con títulos **Portal Proveedores EMPRESA**.
- Esbozar **matriz rol → ítems de menú** (FR-64–67) en implementación; puede empezar con flags mock por rol mapeados a Admin global / área / evaluador / consulta.

**Entregables código:** rutas nuevas, copy, guards por rol ampliados.  
**Docs:** actualizar matriz de progreso en Fase 3.

---

### Fase B — Flujo “Quiero ser proveedor” (Prioridad alta)

**Objetivo:** Wizard navegable completo según guion §4.3 y FR-08–15.

- Stepper: registro → clasificación → cuestionario → carga documental → confirmación/estatus.
- Estados mock: Capturado, En revisión, etc.
- Conectar narrativa “notificación al área” como texto o toast demo (FR-14).

**Reutilización:** estilos `wf-*`, formularios de login.

---

### Fase C — Proveedor activo como hub (Prioridad alta)

**Objetivo:** `ProviderHomePage` como centro de tareas (FR-16–18) alineado al guion §4.4–4.8.

- Enriquecer home: alertas, score, plan de mejora (placeholders enlazados), acceso biblioteca y facturación.
- Menú proveedor: expediente, documentos, evaluación, planes, biblioteca; decidir si contratos/periodos se mantienen como subsección “Operación” o se renombran.
- Rutas nuevas con placeholders navegables donde falte contenido (per `prompts-cursor-implementacion.md`).

---

### Fase D — Interno: operación y control (Prioridad alta)

**Objetivo:** Dashboard, listado, ficha 360 enriquecida, validación, ranking, planes (FR-74–78, 21, 22, 47–48).

- Completar **Ficha 360** con bloques: cumplimiento documental, score, alertas, planes, actividad.
- Nueva **Ranking** (solo interno).
- **Planes de mejora** interno + enlace desde ficha y dashboard.
- Dashboard: KPIs alineados al req (documentos vencidos, evaluaciones pendientes, ranking resumido).

**Reutilización:** `DashboardPage`, `ProvidersPage`, `ProviderDetailPage`, `ValidationPage`.

---

### Fase E — Evaluación extendida (Prioridad alta / transversal)

**Objetivo:** FR-39–51 y guion §4.7.

- Tres fases con pesos y score 0–100, semáforo.
- Vista **proveedor** “Mi evaluación” + histórico.
- Vista interna detalle + ranking alimentado del mismo mock.
- Reglas mock de periodicidad anual / semestral (demostrables con copy o badge).

**Reutilización:** `EvaluationCapturePage`, `evaluationConfig`, `createEvaluation`.

---

### Fase F — Administración, biblioteca, exportables (Prioridad media)

**Objetivo:** FR-34–38, FR-68, FR-79–80.

- Módulo **Biblioteca PDF** (proveedor lectura; admin CRUD mock).
- `CatalogsPage` como **configuración documental** genérica.
- `UsersPage` como **usuarios y roles** negocio.
- `ReportsPage` y exportables como refuerzo de “Power BI ready” en narrativa.

---

### Fase G — Pulido demo (Prioridad baja según req. §11)

- Recuperación de contraseña integrada en flujo público.
- Comunicaciones / historial mínimo vinculado a documentos y planes.
- Limpieza: `App.tsx` huérfano, rename `SESSION_KEY`, mensajes consistentes.

---

## 4. Qué conservar, adaptar, rehacer, eliminar (resumen)

| Decisión | Elementos |
|----------|-----------|
| **Conservar** | Router modular, guards, Zustand auth, mock API, estilos wireframe, mayoría de pantallas internas/proveedor. |
| **Adaptar** | Menús, títulos, modelo Supplier/Document/Evaluation, catálogos, ficha, home, rutas públicas. |
| **Rehacer** (tramos) | Flujo completo proveedor potencial; evaluación por fases + ranking; modelo mock unificado. |
| **Eliminar / aislar** | Dependencia exclusiva de narrativa REPSE en textos principales; código muerto `App.tsx` (cuando se aborde). |

---

## 5. Relación con el storytelling del cliente

| Escena guion | Estado tras reconstrucción esperada |
|--------------|--------------------------------------|
| 1 Landing | Tras Fase A |
| 2 Quiero ser proveedor | Tras Fase B |
| 3 Soy proveedor → home → … | Tras Fase C (+ E para evaluación proveedor) |
| 4 Interno → dashboard → … | Tras Fase D (+ F para admin/biblioteca) |

En cada hito, validar con `guion-demo-cliente.md` §7 (secuencia de clics).

---

## 6. Riesgos mitigados por orden de fases

- **Reescritura masiva sin mapa:** mitigado al exigir Fase 2 (sitemap/rutas) antes de implementación grande.
- **Pantallas huérfanas:** mitigado con rutas placeholder y CTAs primarios por pantalla.
- **Datos contradictorios:** mitigado en Fase 4–5 con `modelo-mock-demo.md` y refactor mock centralizado (prompt 10).

---

## 7. Siguiente acción recomendada

Ejecutar **Fase 2** según `prompts-cursor-sitemap.md`: producir `sitemap-demo.md`, `flujos-demo.md`, `rutas-propuestas.md` y luego `validacion-arquitectura.md`.
