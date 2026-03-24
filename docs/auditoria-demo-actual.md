# Auditoría demo actual — Portal Proveedores EMPRESA

**Fecha:** 2026-03-24  
**Fuente de verdad funcional:** `requerimientos-portal-empresa.md`  
**Guía de storytelling (referencia):** `guion-demo-cliente.md`  
**Alcance:** diagnóstico del repositorio; **sin cambios de código** en esta fase.

---

## 1. Resumen ejecutivo

El prototipo actual es una **demo navegable centrada en REPSE** (periodos, contratos, constancias, validación documental) con **React + Vite + React Router**, autenticación mock (Zustand + `localStorage`) y datos en `src/mock/db.ts`. Cumple parcialmente la idea de “portal con wireframes” y flujos interno/proveedor, pero **no implementa** el journey público ni el flujo **“Quiero ser proveedor”**, ni separa claramente **login interno vs proveedor**, ni alinea roles con los del documento de requerimientos (Administrador global, por área, Evaluador, consulta). La narrativa comercial del `guion-demo-cliente.md` (tres experiencias + administración) **no puede contarse de punta a punta** con el estado actual.

---

## 2. Estructura del proyecto

| Área | Ubicación | Notas |
|------|-----------|--------|
| Entrada SPA | `src/main.tsx` | Monta `RouterProvider` con `src/app/routes.tsx`. |
| Rutas y guards | `src/app/routes.tsx`, `src/app/guards/*` | `RequireAuth`, `RequireRole` (solo en validación y shell proveedor). |
| Layouts | `src/app/layout/AppShell.tsx`, `ProviderShell.tsx`, `AuthShell.tsx` | Interno vs proveedor vs auth. |
| Pantallas | `src/features/*` | Módulos por dominio (auth, dashboard, providers, etc.). |
| Mock | `src/mock/db.ts`, `api.ts`, `types.ts` | Modelo **supplier/contract/period/document** tipo REPSE; no hay modelo de proveedor potencial, planes de mejora, biblioteca, ranking dedicado, etc. |
| Estilos / wireframe | `src/index.css`, clases `wf-*` | Coherencia visual tipo wireframe en varias pantallas. |
| **Huérfano** | `src/App.tsx` | Plantilla Vite por defecto; **no** usada por `main.tsx`. |

**Stack inferido:** React 19 (según estructura típica Vite), React Router, Recharts en dashboard, Sonner para toasts, Zustand para sesión.

---

## 3. Mapa de pantallas existentes (rutas → componente)

| Ruta | Componente | Rol / acceso |
|------|------------|----------------|
| `/login` | `LoginPage` | Público (sin sesión). |
| `/forgot-password` | `ForgotPasswordPage` | Público. |
| `/sin-acceso` | `NoAccessPage` | Tras guard de rol. |
| `/app` | → `/app/dashboard` | Cualquier usuario autenticado **no** PA/PU (en la práctica todos los roles internos entran al shell; ver §5). |
| `/app/dashboard` | `DashboardPage` | Interno (shell App). |
| `/app/proveedores` | `ProvidersPage` | Interno. |
| `/app/proveedores/:id` | `ProviderDetailPage` (“Ficha 360°”) | Interno. |
| `/app/proveedores/:id/contratos` | `ContractsPage` | Interno. |
| `/app/contratos/:id/periodos` | `PeriodsPage` | Interno. |
| `/app/expediente/:proveedorId/:contratoId/:periodoId` | `ExpedientePage` | Interno. |
| `/app/validacion` | `ValidationPage` | Solo roles `VR`, `AP`, `AC`. |
| `/app/evaluacion` | `EvaluationConfigPage` | Interno (sin sub-guard). |
| `/app/evaluacion/:proveedorId` | `EvaluationCapturePage` | Interno. |
| `/app/catalogos` | `CatalogsPage` | Interno. |
| `/app/usuarios` | `UsersPage` | Interno. |
| `/app/reportes` | `ReportsPage` | Interno. |
| `/proveedor/home` | `ProviderHomePage` | Solo `PA`, `PU`. |
| `/proveedor/documentos` | `ProviderDocsPage` | PA, PU. |
| `/proveedor/contratos` | `ProviderContractsPage` | PA, PU. |
| `/proveedor/periodos` | `ProviderPeriodsPage` | PA, PU. |
| `/proveedor/expediente/:periodoId` | `ProviderExpedientePage` | PA, PU. |
| `*` | Redirección a `/login` | **No hay landing pública.** |

---

## 4. Evaluación de la navegación actual

### 4.1 Fortalezas

- Flujo **login → destino** según rol (interno → `/app/dashboard`, proveedor → `/proveedor/home`).
- **Shell distinto** para interno (sidebar) y proveedor (menú horizontal).
- Cadena **listado proveedores → ficha → contratos → periodos → expediente** es navegable en el dominio REPSE.
- **Validación documental** acotada por rol en ruta.
- Textos y KPIs en home proveedor y dashboard conectan con datos mock de periodos/contratos.

### 4.2 Debilidades frente a requerimientos y guion

- **Sin entrada pública:** cualquier URL desconocida manda a login; no existe “Escena 1” del guion (landing con dos CTAs).
- **Un solo login** mezcla internos y proveedores; no hay **login interno EMPRESA** separado como experiencia explícita (aunque se puede simular con selector de rol).
- **Navegación interna homogénea:** el sidebar muestra las mismas entradas a todos los usuarios autenticados “internos”; solo **Validación** está protegida por ruta. No hay menú por **Administrador global / área / evaluador / consulta** como exige FR-64–FR-67.
- **Proveedor:** no hay enlaces de menú a **evaluación propia, planes de mejora, biblioteca PDF, facturación**; el home menciona REPSE y accesos a contratos/periodos/documentos, no el hub de tareas del FR-16–FR-18 ni el guion §4.4–4.8.
- **Terminología:** títulos “Portal REPSE” / “documentos REPSE” chocan con el objetivo de **portal general de proveedores** (req. §1, §10).
- **App.tsx** no aporta a la demo; puede confundir mantenimiento.

### 4.3 Pantallas conectadas vs aisladas

**Bien conectadas (en su dominio actual):**

- Proveedor: home ↔ documentos ↔ contratos ↔ periodos ↔ expediente por `periodoId`.
- Interno: proveedores ↔ detalle (ficha) ↔ contratos ↔ periodos ↔ expediente; ficha ↔ captura evaluación.

**Parcialmente conectadas o débiles:**

- `EvaluationConfigPage` en `/app/evaluacion`: relación con captura por proveedor existe vía ficha, pero no hay vista de **ranking** ni **evaluación para el proveedor**.
- `CatalogsPage` / `UsersPage`: presentes en menú; poca o nula integración con flujos documentales o fichas en el mock.
- `ReportsPage`: export CSV útil para FR-79 a nivel demo, pero no sustituye indicadores del dashboard ni ficha 360 completos.

**Aisladas respecto al storytelling EMPRESA:**

- Todo el **flujo proveedor potencial** (inexistente).
- **Biblioteca PDF, planes de mejora, ranking, recuperación de contraseña** como flujo completo (forgot existe como pantalla; ver matriz).
- **Comunicaciones / notificaciones** como módulo visible coherente con home y dashboard.

---

## 5. Evaluación por requerimiento (síntesis)

El detalle FR por FR está en `matriz-cobertura-actual.md`. Aquí la síntesis por bloque:

| Bloque | Estado global |
|--------|----------------|
| Acceso público y auth (FR-01–07) | **Parcial:** login + forgot; sin landing pública; un solo login; sin flujo explícito “interno vs proveedor” en UX. |
| Registro proveedor potencial (FR-08–15) | **No cubierto.** |
| Home proveedor (FR-16–18) | **Parcial:** KPIs y accesos, pero enfoque REPSE; faltan score, alertas, plan mejora, biblioteca, facturación en navegación. |
| Perfil / expediente / ficha 360 (FR-19–22) | **Parcial:** ficha y expediente existen; perfil genérico y expediente atados a contrato/periodo REPSE, no expediente digital general del req. |
| Gestión documental (FR-23–33) | **Parcial:** carga/estados en demo; categorías empresa/técnica, versionamiento rico, estados completos (p. ej. Vencido en docs), configuración avanzada limitada. |
| Biblioteca (FR-34–38) | **No cubierto.** |
| Evaluación (FR-39–51) | **Parcial:** captura interna con criterios A/B/C y score; no tres fases nominales del req, sin semáforo proveedor, sin ranking, periodicidad mock ausente. |
| Planes de mejora (FR-52–57) | **No cubierto.** |
| Alertas y notificaciones (FR-58–63) | **Parcial mínima** (KPIs); sin sistema de alertas coherente. |
| Administración por roles (FR-64–70) | **Parcial:** roles técnicos distintos; no mapeados a roles negocio; navegación no filtrada por rol salvo excepciones. |
| Comunicación (FR-71–73) | **No / mínimo** (comentarios en validación). |
| Dashboard y analítica (FR-74–80) | **Parcial:** dashboard con gráficas; listado con filtros limitados; consistencia global mock débil para ficha/expediente/evaluación ampliada. |
| Facturación (FR-81–82) | **No cubierto.** |

---

## 6. Clasificación: conservar / adaptar / rehacer / eliminar

| Elemento | Clasificación | Comentario |
|----------|-----------------|------------|
| `AuthShell`, `LoginPage`, flujo sesión Zustand | **Conservar / adaptar** | Base sólida; renombrar copy y rutas; opcional: dos entradas de login desde landing. |
| `ForgotPasswordPage` | **Adaptar** | Alineada a FR-06; integrar en journey público. |
| `ProviderShell` + páginas proveedor | **Adaptar** | Reordenar menú y copy; añadir rutas faltantes; desacoplar narrativa de “solo REPSE” donde moleste. |
| `AppShell` + dashboard, listado, ficha, validación | **Adaptar** | Menú por rol; títulos EMPRESA; enlaces a ranking, planes, config documental. |
| `ExpedientePage` / `ProviderExpedientePage` | **Adaptar** | Extender metadatos/vigencias/observaciones según wireframes generales. |
| `EvaluationCapturePage` + config | **Adaptar / rehacer** partes | Modelar 3 fases, score 0–100, vista proveedor e interna, ranking. |
| `CatalogsPage` | **Adaptar** | Pasar de “Documentos REPSE” a configuración documental del portal general. |
| `UsersPage` | **Adaptar** | Roles negocio + permisos de menú. |
| `ReportsPage` | **Conservar** | Útil para demo exportable; conectar narrativa. |
| Contratos / periodos como eje principal | **Adaptar** | Pueden seguir como **subflujo** o mock de “operación”, pero no deben bloquear el journey “portal general”. |
| `src/App.tsx` (Vite default) | **Eliminar o ignorar** | Evitar ruido; no usado por la app real. |
| Nombre de sesión `repse_demo_session` | **Adaptar** | Renombrar cuando se unifique marca demo EMPRESA. |

---

## 7. Riesgos y observaciones técnicas

- **Modelo de datos:** `Supplier` ≠ “proveedor potencial + activo” con estatus de solicitud; `DocumentStatus` no incluye `Vencido`; evaluaciones vacías en seed dificultan demo de score en ficha.
- **Guards:** La mayoría de rutas `/app/*` no validan rol; un usuario CO podría entrar a usuarios o evaluación según política deseada — para la demo EMPRESA habrá que **definir matriz rol × ruta** explícita.
- **Coherencia mock:** ficha lee `db.evaluations` pero el array inicia vacío; la “evaluación vigente” no se muestra hasta capturar — para el guion conviene **seed** coherente.

---

## 8. Próximos pasos (fuera de esta fase)

La **propuesta de sitemap, rutas y estrategia por fases** se documenta en `plan-reconstruccion.md`. El detalle de arquitectura de navegación y rutas propuestas corresponde a la **Fase 2** (`prompts-cursor-sitemap.md`).

---

## Referencias en código

- Router: `src/app/routes.tsx`
- Layouts: `src/app/layout/AppShell.tsx`, `ProviderShell.tsx`
- Mock: `src/mock/db.ts`, `src/mock/types.ts`
