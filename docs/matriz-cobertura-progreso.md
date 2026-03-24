# Matriz de cobertura — progreso post Fase 3

**Fecha:** 2026-03-24  
**Referencia base:** `matriz-cobertura-actual.md` + `requerimientos-portal-empresa.md`  
**Alcance:** cubre lo implementado en código tras la **Fase 3** (navegación, rutas, layouts, pantallas base y mock ampliado). No sustituye la validación final (Fase 5).

---

## Resumen

Tras la Fase 3, la demo ya permite **contar los tres journeys principales a nivel de navegación**: entrada pública y registro potencial, portal proveedor con hub ampliado, portal interno con menú por rol, ranking, planes de mejora y biblioteca. Persisten **parcialidades** en profundidad funcional (versionado documental, alertas automáticas, multi-área, periodicidad evaluación, etc.).

---

## Bloques — estado actualizado (alto nivel)

| Bloque req. | Antes (Fase 1) | Tras Fase 3 |
|-------------|----------------|-------------|
| FR-01–04 Público / CTAs | No | **Sí** — landing + rutas |
| FR-05–07 Auth | Parcial | **Parcial** — logins separados; recuperación en ruta pública |
| FR-08–15 Registro potencial | No | **Parcial** — wizard completo mock + seguimiento demo |
| FR-16–18 Home proveedor | Parcial | **Parcial** — KPIs ampliados, accesos al guion |
| FR-19–22 Perfil / expediente / ficha | Parcial | **Parcial** — expediente interno por proveedor + hub proveedor + ficha con enlaces |
| FR-23–33 Documental | Parcial | **Parcial** — sin cambio profundo de estados/tipos |
| FR-34–38 Biblioteca | No | **Parcial** — lectura proveedor + admin mock |
| FR-39–51 Evaluación | Parcial | **Parcial** — vista proveedor + detalle fases; ranking interno; seed evaluación |
| FR-52–57 Planes mejora | No | **Parcial** — listados/detalles mock proveedor e interno |
| FR-58–63 Alertas | Parcial mínima | **Parcial mínima** — sin bandeja dedicada |
| FR-64–70 Roles | Parcial | **Parcial** — menú por rol técnico; no `businessRole` persistido en usuario |
| FR-71–73 Comunicación | Mínimo | **Mínimo** |
| FR-74–80 Dashboard / analítica | Parcial | **Parcial** — mismas gráficas; más coherencia con mock |
| FR-81–82 Facturación | No | **Sí** — página con URL configurable en `demoConfig` |

---

## Pantallas mínimas del §7 — progreso

| # | Pantalla | Estado tras Fase 3 |
|---|----------|---------------------|
| 1 | Landing | **Sí** |
| 2–3 | Login proveedor / interno | **Parcial** — dos rutas, misma lógica mock |
| 4–8 | Flujo potencial | **Parcial** — wizard + confirmación + seguimiento |
| 9 | Home proveedor | **Parcial** |
| 10–12 | Expediente, documentos, carga | **Parcial** |
| 13–14 | Mi evaluación y detalle | **Parcial** |
| 15 | Planes proveedor | **Parcial** |
| 16 | Biblioteca PDF | **Parcial** |
| 17–21 | Dashboard, listado, ficha, validación, ranking | **Parcial** — ranking **Sí** |
| 22 | Planes interno | **Parcial** |
| 23–24 | Config documental, usuarios | **Parcial** — rutas `/app/config` y `/app/admin` |

---

## Próximas fases sugeridas (recordatorio)

- **Fase 4 (`prompts-cursor-modulos.md`):** profundizar wizard UX, evaluación 0–100 explícita y semáforo unificado, acciones consulta (solo lectura) en validación, modelo mock centralizado (`modelo-mock-demo.md`).  
- **Fase 5:** readiness comercial y matriz final.

---

# Matriz de cobertura — progreso post Fase 3

**Fecha:** 2026-03-24  
**Referencia base:** `matriz-cobertura-actual.md` + `requerimientos-portal-empresa.md`  
**Alcance:** cubre lo implementado en código tras la **Fase 3** (navegación, rutas, layouts, pantallas base y mock ampliado). No sustituye la validación final (Fase 5).

---

## Resumen

Tras la Fase 3, la demo ya permite **contar los tres journeys principales a nivel de navegación**: entrada pública y registro potencial, portal proveedor con hub ampliado, portal interno con menú por rol, ranking, planes de mejora y biblioteca. Persisten **parcialidades** en profundidad funcional (versionado documental, alertas automáticas, multi-área, periodicidad evaluación, etc.).

---

## Bloques — estado actualizado (alto nivel)

| Bloque req. | Antes (Fase 1) | Tras Fase 3 |
|-------------|----------------|-------------|
| FR-01–04 Público / CTAs | No | **Sí** — landing + rutas |
| FR-05–07 Auth | Parcial | **Parcial** — logins separados; recuperación en ruta pública |
| FR-08–15 Registro potencial | No | **Parcial** — wizard completo mock + seguimiento demo |
| FR-16–18 Home proveedor | Parcial | **Parcial** — KPIs ampliados, accesos al guion |
| FR-19–22 Perfil / expediente / ficha | Parcial | **Parcial** — expediente interno por proveedor + hub proveedor + ficha con enlaces |
| FR-23–33 Documental | Parcial | **Parcial** — sin cambio profundo de estados/tipos |
| FR-34–38 Biblioteca | No | **Parcial** — lectura proveedor + admin mock |
| FR-39–51 Evaluación | Parcial | **Parcial** — vista proveedor + detalle fases; ranking interno; seed evaluación |
| FR-52–57 Planes mejora | No | **Parcial** — listados/detalles mock proveedor e interno |
| FR-58–63 Alertas | Parcial mínima | **Parcial mínima** — sin bandeja dedicada |
| FR-64–70 Roles | Parcial | **Parcial** — menú por rol técnico; no `businessRole` persistido en usuario |
| FR-71–73 Comunicación | Mínimo | **Mínimo** |
| FR-74–80 Dashboard / analítica | Parcial | **Parcial** — mismas gráficas; más coherencia con mock |
| FR-81–82 Facturación | No | **Sí** — página con URL configurable en `demoConfig` |

---

## Pantallas mínimas del §7 — progreso

| # | Pantalla | Estado tras Fase 3 |
|---|----------|---------------------|
| 1 | Landing | **Sí** |
| 2–3 | Login proveedor / interno | **Parcial** — dos rutas, misma lógica mock |
| 4–8 | Flujo potencial | **Parcial** — wizard + confirmación + seguimiento |
| 9 | Home proveedor | **Parcial** |
| 10–12 | Expediente, documentos, carga | **Parcial** |
| 13–14 | Mi evaluación y detalle | **Parcial** |
| 15 | Planes proveedor | **Parcial** |
| 16 | Biblioteca PDF | **Parcial** |
| 17–21 | Dashboard, listado, ficha, validación, ranking | **Parcial** — ranking **Sí** |
| 22 | Planes interno | **Parcial** |
| 23–24 | Config documental, usuarios | **Parcial** — rutas `/app/config` y `/app/admin` |

---

## Próximas fases sugeridas (recordatorio)

- **Fase 4 (`prompts-cursor-modulos.md`):** profundizar wizard UX, evaluación 0–100 explícita y semáforo unificado, acciones consulta (solo lectura) en validación, modelo mock centralizado (`modelo-mock-demo.md`).  
- **Fase 5:** readiness comercial y matriz final.

---

## Nota de sesión

Renombrado almacenamiento de sesión: ver `rutas-implementadas.md`.

## Avance de Reconstrucción

### Fase A y Fase B (Revisadas y Completadas)
- **Qué cambié:** Tras auditar el código, se constató que la arquitectura de la **Fase A** (Routing y layouts por rol) y **Fase B** (Landing pública) ya está reflejada en `src/app/routes.tsx`, `LandingPage.tsx` y `LoginPage.tsx`. No fue necesario realizar modificaciones en código en este paso.
- **Qué requerimientos cubrí:** 
  - FR-01 a FR-04 (Landing pública y accesos separados).
  - FR-05 a FR-07 (Autenticación y login).
  - FR-64 a FR-67 (Base de administración de navegación por rol técnico).

### Fase D, E y F (Mejoras UX y Flujos Integrados)
- **Qué cambié:** 
  1. Se refactorizó **ProviderHomePage** para incorporar un hub de tareas con un CTA principal de "Atención requerida" para documentos urgentes.
  2. Se añadieron opciones rápidas (inline) en **ExpedientePage** para que los validadores puedan Aprobar/Rechazar en la misma fila del documento.
  3. Se reestructuró la gigante **EvaluationCapturePage** en un **Wizard interactivo de 3 pasos** (Potencial, Funcionamiento, Estrategia) con score proyectado final.
  4. Se agregó semaforización visual de scores a la **RankingPage**.
- **Qué requerimientos cubrí:**
  - FR-16 a FR-18 (Home Hub de pendientes).
  - FR-39 a FR-51 (Evaluaciones segmentadas y Ranking visual).
  - FR-23 a FR-33 (Expediente accionable).
- **Qué falta:** Proceder a realizar las verificaciones y pulidos finales estéticos (Fase G/H).
