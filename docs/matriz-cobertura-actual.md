# Matriz de cobertura actual vs requerimientos

**Fecha:** 2026-03-24  
**Referencia:** `requerimientos-portal-empresa.md`  
**Estado del código:** auditoría Fase 1 (sin implementación nueva).

Leyenda de cobertura:

- **Sí** — Cubierto de forma razonable para una demo.
- **Parcial** — Existe algo relacionado pero incompleto o desalineado con el FR o el guion.
- **No** — Ausente o no demostrable en navegación/mock actual.

---

## 6.1 Acceso público y autenticación

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-01 | No | — | No hay landing pública; `*` → `/login`. |
| FR-02 | No | — | Sin “Soy proveedor” / “Quiero ser proveedor” en UI pública. |
| FR-03 | No | — | Depende de landing; hoy solo `/login`. |
| FR-04 | No | — | Sin wizard de alta potencial. |
| FR-05 | Parcial | `LoginPage` + `api.login` | Auth mock por credenciales/rol; copy “Portal REPSE”. |
| FR-06 | Parcial | `ForgotPasswordPage` | Ruta existe; no enlazada desde journey público completo. |
| FR-07 | Parcial | Mismo `LoginPage` | No hay login interno dedicado ni separación UX clara. |

---

## 6.2 Registro proveedor potencial

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-08 a FR-15 | No | — | Sin registro, clasificación, cuestionario, carga inicial, estatus ni consulta de estatus potencial. |

---

## 6.3 Home del proveedor activo

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-16 | Parcial | `ProviderHomePage` | KPIs: pendientes, vencimientos, contratos; faltan alertas, score, notificaciones, plan mejora como bloques claros. |
| FR-17 | Parcial | `ProviderHomePage` + `ProviderShell` | Accesos a documentos/contratos/periodos; faltan expediente como ítem principal, evaluación, planes, políticas, facturación. |
| FR-18 | Parcial | Mismo | Orientado a tareas REPSE más que a hub general del portal EMPRESA. |

---

## 6.4 Perfil, expediente y ficha

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-19 | Parcial | `ProviderDetailPage` / datos en listados | No hay “mi perfil” proveedor dedicado con contactos/categoría ricos. |
| FR-20 | Parcial | `ExpedientePage`, `ProviderExpedientePage` | Expediente ligado a contrato/periodo; no expediente digital completo del req. |
| FR-21 | Parcial | `ProviderDetailPage` | “Ficha 360°” básica; faltan cumplimiento documental agregado, alertas, planes, actividad reciente rica. |
| FR-22 | No / Parcial | — | Sin flujo de edición de datos por permisos. |

---

## 6.5 Gestión documental

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-23 | Parcial | Docs por periodo | No separado explícitamente empresa vs técnicos. |
| FR-24 | Parcial | `CatalogsPage` (tabla demo) | Matriz tipo config; no editable end-to-end. |
| FR-25 | Parcial | Implícito en copy | PDF mencionable; no validación fuerte en UI. |
| FR-26 | Parcial | Catálogo demo | Tamaño máximo no modelado. |
| FR-27 | Parcial | `ProviderDocsPage`, carga mock | Enfoque REPSE. |
| FR-28 | Parcial | Listados documento | Vigencia/versiones/observaciones limitadas en UI. |
| FR-29 | No | — | Sin histórico de versiones explícito. |
| FR-30 | Parcial | APIs `approveDoc` / `rejectDoc` | Reemplazo vencido no modelado como tal. |
| FR-31 | Parcial | `ValidationPage` | Aprobación/rechazo demo. |
| FR-32 | Parcial | `DocumentStatus` en types | Falta `Vencido` en tipo; estados no todos reflejados en UI. |
| FR-33 | Parcial | Varios | Consistencia global mejorable con mock unificado. |

---

## 6.6 Biblioteca PDF

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-34 a FR-38 | No | — | Sin módulo biblioteca ni admin de publicación. |

---

## 6.7 Evaluación de desempeño

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-39 | Parcial | `EvaluationCapturePage` | Evaluación interna. |
| FR-40 | No | Criterios A/B/C | No modeladas como “potencial / funcionamiento / capacidad estratégica”. |
| FR-41 | Parcial | Config + captura | Pesos mock en config; escala 0–5 por criterio, no 0–100 directo. |
| FR-42 | Parcial | `createEvaluation` | Cálculo en API mock; verificar alineación escala final vs FR-43. |
| FR-43 | Parcial | — | Necesidad de score 0–100 explícito en UI proveedor e interno. |
| FR-44 | No | — | Sin semáforo/badge en vistas clave del guion. |
| FR-45 | No | — | Proveedor no tiene “Mi evaluación”. |
| FR-46 | Parcial | Ficha + captura | Detalle por fase no como en req. |
| FR-47 | No | — | Sin pantalla ranking. |
| FR-48 | No | — | — |
| FR-49 | No | — | Periodicidad anual mock. |
| FR-50 | No | — | Regla score &lt; 70 → semestral. |
| FR-51 | Parcial | `listEvaluations` | Histórico posible en captura; seed vacío. |

---

## 6.8 Planes de mejora

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-52 a FR-57 | No | — | Sin listados, evidencias ni seguimiento. |

---

## 6.9 Alertas y notificaciones

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-58 a FR-61 | No | — | Sin generación mock de alertas por reglas. |
| FR-62 | Parcial | `ProviderHomePage` | KPIs aproximados, no bandeja de alertas. |
| FR-63 | Parcial | `DashboardPage` | Sin alertas operativas detalladas en ficha/dashboard. |

---

## 6.10 Administración por roles

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-64 | Parcial | Roles en `types.ts` | Roles técnicos AP, AC, CO, VR, TI, PA, PU ≠ roles negocio del doc. |
| FR-65 | Parcial | — | “Proveedor” sí; faltan admin global, área, evaluador, consulta como modelo UX. |
| FR-66 | No | — | Multi-área no modelado. |
| FR-67 | No | `AppShell` | Mismo menú para casi todos los internos. |
| FR-68 | Parcial | `UsersPage`, `CatalogsPage` | Existen; permisos y alcance global no demostrados. |
| FR-69 | No | — | — |
| FR-70 | Parcial | `UsersPage` | Depende de implementación real de la página (no auditada línea a línea). |

---

## 6.11 Comunicación y seguimiento

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-71 a FR-73 | Parcial mínima | Validación / comentarios | Sin historial formal de comunicaciones. |

---

## 6.12 Dashboard, listados y analítica

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-74 | Parcial | `DashboardPage` | Ejecutivo REPSE; falta alinear KPIs al req (doc vencidos, eval pendientes, ranking resumido, etc.). |
| FR-75 | Parcial | Mismo | Parcialmente cubierto con gráficas y datos mock. |
| FR-76 | Parcial | `ProvidersPage` | Filtros completos del req no verificados en esta auditoría como “completos”. |
| FR-77 | Sí | Enlaces a detalle | Desde listado a ficha. |
| FR-78 | Parcial | — | Evaluaciones vacías debilitan consistencia. |
| FR-79 | Parcial | `ReportsPage` | Export CSV demo. |
| FR-80 | Parcial | `db` central | Falta extender entidades (planes, biblioteca, potenciales) en un solo modelo. |

---

## 6.13 Facturación

| ID | Cobertura | Pantalla / módulo actual | Observaciones |
|----|-----------|---------------------------|---------------|
| FR-81 | No | — | Sin liga visible. |
| FR-82 | No | — | Sin configuración mock de URL. |

---

## Pantallas mínimas del demo (sección 7 del req.)

| # | Pantalla mínima | Estado actual |
|---|-----------------|---------------|
| 1 | Landing pública | **No** |
| 2 | Login proveedor | **Parcial** (login unificado) |
| 3 | Login interno EMPRESA | **Parcial** |
| 4–8 | Flujo proveedor potencial | **No** |
| 9 | Home proveedor | **Parcial** |
| 10–12 | Expediente, documentos, carga | **Parcial** |
| 13–14 | Mi evaluación, detalle | **No** (solo captura interna) |
| 15 | Planes mejora proveedor | **No** |
| 16 | Biblioteca PDF | **No** |
| 17–21 | Dashboard, listado, ficha 360, validación, ranking | **Parcial** (sin ranking) |
| 22 | Planes mejora interno | **No** |
| 23–24 | Config documental, usuarios/roles | **Parcial** |

---

## Resumen numérico (aprox.)

- **Sí:** pocos (p. ej. navegación básica listado → detalle).
- **Parcial:** mayoría de bloques donde ya hay prototipo REPSE o piezas administrativas.
- **No:** flujo público completo, potencial, biblioteca, planes de mejora, ranking, facturación, muchas reglas de evaluación y alertas.

Este documento debe actualizarse en fases posteriores como `matriz-cobertura-progreso.md` según `prompts-cursor-implementacion.md`.
