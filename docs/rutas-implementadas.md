# Rutas implementadas — Demo Portal Proveedores EMPRESA

**Fecha:** 2026-03-24  
**Fase:** 3 (navegación y layouts según `rutas-propuestas.md`)  
**Router:** `src/app/routes.tsx`

---

## Leyenda de estado

| Estado | Significado |
|--------|-------------|
| **Listo** | UI funcional con CTA y datos mock. |
| **Listo (mock)** | Flujo o acción simulada (toast, sin backend). |
| **Redirect** | Compatibilidad con rutas legacy. |
| **Protegido** | `RequireAuth` y/o `RequireRole` según tabla. |

---

## Público (sin sesión)

| Ruta | Rol | Pantalla | Propósito | Estado |
|------|-----|----------|-----------|--------|
| `/` | Público | `LandingPage` | FR-01, FR-02 | Listo |
| `/login/proveedor` | Público | `LoginPage` (audience proveedor) | FR-03, FR-05 | Listo |
| `/login/empresa` | Público | `LoginPage` (audience empresa) | FR-07 | Listo |
| `/login` | — | → `/` | Evita login ambiguo | Redirect |
| `/recuperar-contrasena` | Público | `ForgotPasswordPage` | FR-06 | Listo (mock) |
| `/forgot-password` | — | → `/recuperar-contrasena` | Alias | Redirect |
| `/registro` | Público | → `/registro/datos` | Entrada wizard | Redirect |
| `/registro/datos` … `/registro/confirmacion` | Público | Wizard registro | FR-08–14 | Listo (mock) |
| `/registro/seguimiento/:id` | Público | `RegisterSeguimientoPage` | FR-15 | Listo (mock) |

**Layouts:** `PublicLayout` (`/`), `AuthShell` (login/recuperar), `RegistrationLayout` (`/registro/*`).

---

## Proveedor activo (`PA`, `PU`)

**Guard:** `RequireAuth` → `/login/proveedor`; `ProviderShell` rechaza usuarios internos → `/app/dashboard`.

| Ruta | Pantalla | Propósito | Estado |
|------|----------|-----------|--------|
| `/proveedor` | → `home` | — | Redirect |
| `/proveedor/home` | `ProviderHomePage` | Hub FR-16–18 | Listo |
| `/proveedor/expediente` | `ProviderExpedienteHubPage` | Expediente agregado FR-20 | Listo |
| `/proveedor/documentos` | `ProviderDocsPage` | Documentos / carga | Listo |
| `/proveedor/evaluacion` | `ProviderEvaluationPage` | Score proveedor FR-45 | Listo |
| `/proveedor/evaluacion/detalle` | `ProviderEvaluationDetailPage` | Fases FR-40 (mapeo A/B/C) | Listo |
| `/proveedor/planes` | `ProviderPlanesPage` | Planes FR-52–54 | Listo |
| `/proveedor/planes/:id` | `ProviderPlanDetailPage` | Detalle + evidencia mock | Listo (mock) |
| `/proveedor/biblioteca` | `ProviderBibliotecaPage` | Biblioteca lectura FR-34–35 | Listo |
| `/proveedor/facturacion` | `ProviderFacturacionPage` | FR-81–82 URL configurable | Listo |
| `/proveedor/operacion/contratos` | `ProviderContractsPage` | Legacy operativo | Listo |
| `/proveedor/operacion/periodos` | `ProviderPeriodsPage` | Legacy operativo | Listo |
| `/proveedor/operacion/expediente/:periodoId` | `ProviderExpedientePage` | Expediente por periodo | Listo |
| `/proveedor/contratos` | → operación | Compatibilidad | Redirect |
| `/proveedor/periodos` | → operación | Compatibilidad | Redirect |
| `/proveedor/expediente/:periodoId` | → operación | Compatibilidad | Redirect |

---

## Usuario interno EMPRESA (`AP`, `AC`, `CO`, `VR`, `TI`)

**Guard:** `RequireAuth` → `/login/empresa`; `AppShell` rechaza `PA`/`PU` → `/proveedor/home`.

### Rutas comunes (todos los roles internos)

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/app` | → `dashboard` | Redirect |
| `/app/dashboard` | `DashboardPage` | Listo |
| `/app/proveedores` | `ProvidersPage` | Listo |
| `/app/proveedores/:id` | `ProviderDetailPage` (Ficha 360) | Listo |
| `/app/proveedores/:id/expediente` | `InternalProveedorExpedientePage` | Listo |
| `/app/proveedores/:id/contratos` | `ContractsPage` | Listo |
| `/app/contratos/:id/periodos` | `PeriodsPage` | Listo |
| `/app/expediente/...` | `ExpedientePage` | Listo |

### Roles `VR`, `AP`, `AC`, `CO` (no `TI`)

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/app/validacion` | `ValidationPage` | Listo |
| `/app/evaluacion` | `EvaluationConfigPage` | Listo |
| `/app/evaluacion/:proveedorId` | `EvaluationCapturePage` | Listo |
| `/app/ranking` | `RankingPage` | Listo |
| `/app/planes-mejora` | `InternalPlanesMejoraPage` | Listo |
| `/app/planes-mejora/:id` | `InternalPlanDetailPage` | Listo (mock) |

### Roles `AP`, `AC`, `CO` (no `TI`, no `VR` solo para reportes/config)

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/app/reportes` | `ReportsPage` | Listo |
| `/app/config/documentos` | `CatalogsPage` | Listo |

### Roles `AP`, `AC` únicamente

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/app/admin/usuarios` | `UsersPage` | Listo |
| `/app/admin/biblioteca` | `AdminBibliotecaPage` | Listo (mock) |

### Redirects legacy internos

| Ruta | Destino |
|------|---------|
| `/app/catalogos` | `/app/config/documentos` |
| `/app/usuarios` | `/app/admin/usuarios` |

---

## Errores y comodín

| Ruta | Comportamiento |
|------|----------------|
| `/sin-acceso` | `NoAccessPage` |
| `*` | `CatchAllNavigate`: sin sesión → `/`; proveedor → `/proveedor/home`; interno → `/app/dashboard` |

---

## Menú lateral interno (`AppShell`)

Generado según rol técnico: `TI` (consulta) ve solo Dashboard y Proveedores; `VR`+ ve validación, evaluación, ranking, planes; `CO`+ reportes y config; `AP`/`AC` + usuarios y biblioteca admin. Detalle en `src/app/layout/AppShell.tsx`.

---

## Sesión demo

Clave `localStorage`: `portal_proveedores_demo_session` (antes `repse_demo_session`). Los usuarios deben volver a iniciar sesión tras el cambio.

---

## Archivos clave añadidos o tocados

- `src/app/layout/PublicLayout.tsx`, `RegistrationLayout.tsx`
- `src/app/guards/CatchAllNavigate.tsx`
- `src/app/redirects/ProviderLegacyRedirects.tsx`
- `src/app/roleMapping.ts` (mapeo negocio; menú usa reglas por rol técnico en `AppShell`)
- `src/features/public/LandingPage.tsx`
- `src/features/registration/*`
- `src/features/internal/*`, páginas proveedor adicionales
- `src/mock/db.ts` (planes, biblioteca, evaluación seed, `demoConfig`)
