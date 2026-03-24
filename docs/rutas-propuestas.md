# Rutas propuestas — Demo Portal Proveedores EMPRESA

**Fecha:** 2026-03-24  
**Referencias:** `sitemap-demo.md`, `flujos-demo.md`, `auditoria-demo-actual.md`  
**Convenciones:** rutas en minúsculas; segmentos en español donde ya existe el producto; compatibilidad con rutas actuales indicada explícitamente.

---

## 1. Roles de negocio y mapeo técnico (demo)

Para la implementación mock se recomienda **extender** `Role` o añadir `businessRole` en el usuario:

| Rol negocio | Código sugerido | Notas |
|-------------|-----------------|--------|
| Administrador global | `ADMIN_GLOBAL` | Acceso completo menú interno + admin. |
| Administrador por área | `ADMIN_AREA` | Sin algunas rutas `/app/admin/*` globales. |
| Evaluador | `EVALUADOR` | Validación, evaluación, planes. |
| Usuario de consulta | `CONSULTA` | Solo lectura: sin POST en validación. |
| Proveedor | `PROVEEDOR` | Mapear desde `PA` / `PU` actuales o unificar. |

**Transición desde código actual:** mantener login por email/rol técnico mientras se introduce tabla de mapeo `role → businessRole` en mock (`db.users`).

---

## 2. Tabla maestra de rutas

### 2.1 Públicas (sin `RequireAuth`)

| Ruta | Pantalla | Propósito |
|------|----------|-----------|
| `/` | Landing | FR-01, FR-02 |
| `/login/proveedor` | Login proveedor | FR-03, FR-05 |
| `/login/empresa` | Login interno | FR-07 |
| `/recuperar-contrasena` | Recuperar | FR-06 (alias compatible: `/forgot-password` → redirect) |
| `/registro` | Redirect | Redirige a `/registro/datos` |
| `/registro/datos` | Paso 1 wizard | FR-08, FR-09 |
| `/registro/clasificacion` | Paso 2 | FR-10 |
| `/registro/cuestionario` | Paso 3 | FR-11 |
| `/registro/documentos` | Paso 4 | FR-12 |
| `/registro/confirmacion` | Paso 5 | FR-13, FR-14 (mensaje demo) |
| `/registro/seguimiento/:id` | Estatus (opcional) | FR-15 |

---

### 2.2 Proveedor activo (`RequireAuth` + rol proveedor)

| Ruta | Pantalla | Notas |
|------|----------|--------|
| `/proveedor` | Redirect | → `/proveedor/home` |
| `/proveedor/home` | Home | FR-16–18 |
| `/proveedor/expediente` | Expediente | FR-20; puede absorber vista agregada sin periodo |
| `/proveedor/documentos` | Mis documentos | FR-27–30; modal ruta opcional `?cargar=id` |
| `/proveedor/evaluacion` | Mi evaluación | FR-45 |
| `/proveedor/evaluacion/detalle` | Detalle / fases | FR-40–44 |
| `/proveedor/planes` | Planes de mejora | FR-52–54 |
| `/proveedor/planes/:id` | Detalle plan | FR-53, 55–57 |
| `/proveedor/biblioteca` | Biblioteca PDF | FR-34–35, 38 |
| `/proveedor/facturacion` | Liga facturación | FR-81–82 (CTA externa) |

**Legacy (conservar durante transición):**

| Ruta actual | Destino propuesto |
|-------------|-------------------|
| `/proveedor/contratos` | `/proveedor/operacion/contratos` o mantener ruta y renombrar etiqueta menú |
| `/proveedor/periodos` | `/proveedor/operacion/periodos` |
| `/proveedor/expediente/:periodoId` | Mantener bajo `/proveedor/operacion/expediente/:periodoId` |

Recomendación: **mantener URLs antiguas** con redirects 301 client-side (`Navigate`) para no romper bookmarks durante la demo.

---

### 2.3 Interno EMPRESA (`RequireAuth` + rol interno)

| Ruta | Pantalla | Roles (negocio) |
|------|----------|------------------|
| `/app` | Redirect | → `/app/dashboard` |
| `/app/dashboard` | Dashboard | Todos los internos |
| `/app/proveedores` | Listado | Todos |
| `/app/proveedores/:id` | Ficha 360 | Todos |
| `/app/proveedores/:id/expediente` | Expediente interno | Todos consulta; acciones según rol |
| `/app/validacion` | Validación documental | Evaluador, Admin global, Admin área (política demo) |
| `/app/evaluacion` | Índice / config evaluación | Evaluador, Admin |
| `/app/evaluacion/:proveedorId` | Captura / detalle | Mismo |
| `/app/ranking` | Ranking | Internos excepto solo consulta si se define así |
| `/app/planes-mejora` | Listado planes | Evaluador, Admin |
| `/app/planes-mejora/:id` | Detalle plan | Mismo |
| `/app/reportes` | Reportes / exportables | Admin área, Admin global (mínimo) |

**Legacy interno (opcional mantener):**

| Ruta actual | Acción |
|-------------|--------|
| `/app/proveedores/:id/contratos` | Mantener; enlace desde ficha “Operación” |
| `/app/contratos/:id/periodos` | Mantener |
| `/app/expediente/:proveedorId/:contratoId/:periodoId` | Mantener o unificar con `/app/proveedores/:id/expediente` |

---

### 2.4 Administración / configuración

| Ruta | Pantalla | Roles |
|------|----------|--------|
| `/app/config/documentos` | Configuración documental | Admin global (Admin área lectura opcional) |
| `/app/admin/usuarios` | Usuarios y roles | Admin global |
| `/app/admin/biblioteca` | Admin biblioteca PDF | Admin global |

**Migración desde actual:**

- `/app/catalogos` → redirect a `/app/config/documentos` o unificar nombre en menú.  
- `/app/usuarios` → redirect a `/app/admin/usuarios`.

---

### 2.5 Errores y catch-all

| Ruta | Comportamiento |
|------|----------------|
| `/sin-acceso` | Sin permiso (actual) |
| `*` | Si **no** autenticado y ruta desconocida → `/`. Si autenticado → home del rol ( `/app/dashboard` o `/proveedor/home` ). Evitar enviar todo a `/login` como hoy. |

---

## 3. Matriz rol → ítems de menú (interno)

Leyenda: ✓ visible, ✗ oculto, ◐ solo lectura / parcial.

| Ítem | CONSULTA | EVALUADOR | ADMIN_AREA | ADMIN_GLOBAL |
|------|----------|-----------|------------|---------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Proveedores | ✓ | ✓ | ✓ | ✓ |
| Validación | ✗ | ✓ | ◐ | ✓ |
| Evaluación | ✗ | ✓ | ✓ | ✓ |
| Ranking | ✗ | ✓ | ✓ | ✓ |
| Planes de mejora | ✗ | ✓ | ✓ | ✓ |
| Reportes | ✗ | ✗ | ✓ | ✓ |
| Config documentos | ✗ | ✗ | ◐ | ✓ |
| Usuarios | ✗ | ✗ | ✗ | ✓ |
| Biblioteca (admin) | ✗ | ✗ | ✗ | ✓ |

*(◐ es configurable según storytelling; la tabla es el default recomendado para demo.)*

---

## 4. Protección mock

1. **`RequireAuth`:** sesión presente.  
2. **`RequireRole`:** lista de códigos técnicos o negocio permitidos por ruta.  
3. **`RequireBusinessCapability`:** opcional para acciones (aprobar doc, guardar evaluación) devolviendo toast “Sin permiso en demo” para usuarios consulta.

Redirección: sin sesión en ruta privada → `/login/proveedor` o `/login/empresa` según prefijo, o `/` con modal “elige tipo de acceso”.

---

## 5. Placeholders

Toda ruta nueva sin UI final debe renderizar **página mínima** con: título, descripción de propósito, CTA “Volver a inicio” y enlace al siguiente paso del guion (req. implementación: evitar pantallas muertas).

---

## 6. Resumen de cambios respecto al repo actual

| Tema | Actual | Propuesto |
|------|--------|-----------|
| Entrada | `*` → `/login` | `*` → `/` o login contextual |
| Login | `/login` único | `/login/proveedor`, `/login/empresa` |
| Registro | No existe | `/registro/*` |
| Proveedor menú | 4 ítems | + expediente agregado, evaluación, planes, biblioteca, facturación, operación opcional |
| Interno menú | Plano | Filtrado por rol + ranking + planes + admin |
| Catálogos / usuarios | `/app/catalogos`, `/app/usuarios` | Rutas agrupadas bajo `/app/config/*`, `/app/admin/*` |

---

## 7. Próximo paso

Validación crítica frente a FR: `validacion-arquitectura.md`.
