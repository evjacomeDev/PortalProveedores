# Flujos demo — Portal Proveedores EMPRESA

**Fecha:** 2026-03-24  
**Referencias:** `requerimientos-portal-empresa.md` §5, `guion-demo-cliente.md` §4 y §7, `sitemap-demo.md`  
**Estado:** especificación de journeys y CTAs (Fase 2).

---

## 1. Flujos obligatorios del requerimiento (resumen narrativo)

### 1.1 Flujo público — Soy proveedor

| Paso | Pantalla | CTA primario |
|------|----------|----------------|
| 1 | Landing | “Soy proveedor” |
| 2 | Login proveedor | “Iniciar sesión” |
| 3 | Home proveedor | “Ir a pendientes” / “Mis documentos” (según mock) |

**Salidas laterales:** “Recuperar contraseña” desde login; “Volver al inicio” en footer.

---

### 1.2 Flujo público — Quiero ser proveedor

| Paso | Pantalla (wizard) | CTA primario |
|------|-------------------|----------------|
| 1 | Registro datos generales | “Siguiente” |
| 2 | Clasificación | “Siguiente” (habilitar según selección) |
| 3 | Cuestionario por categoría | “Siguiente” |
| 4 | Carga documental inicial | “Siguiente” (con estados por documento) |
| 5 | Confirmación / estatus | “Volver al inicio” o “Consultar estatus” (opcional) |

**UX:** stepper visible; **Anterior** siempre excepto paso 1; **Guardar borrador** opcional (toast mock).

**Post-condición demo:** estatus “En revisión”; mensaje de notificación al área interna (banner o toast).

---

### 1.3 Flujo proveedor activo (después de login)

Secuencia alineada a §5.2 del req. y guion §4.4–4.8:

```
Home proveedor
  → Mi expediente
  → Mis documentos
  → [modal o subvista] Subir / reemplazar
  → Resultado de validación (toast o bloque en documento)
  → Mi evaluación
  → Score / semáforo / histórico
  → Planes de mejora
  → Biblioteca PDF
  → Facturación (liga externa o página puente)
```

**Navegación:** el home debe enlazar en **un clic** a: documentos, evaluación, planes, biblioteca, facturación (FR-17, §8.5).

**Subflujo opcional (legacy REPSE):** Home → Operación → Contratos → Periodos → Expediente por periodo (mantiene demo densa sin bloquear el guion general).

---

### 1.4 Flujo usuario interno EMPRESA

```
Login empresa
  → Dashboard
  → Listado de proveedores
  → Ficha 360
  → Validación documental (desde menú o desde ficha)
  → Evaluación (listado o desde ficha)
  → Ranking
  → Planes de mejora
  → Configuración / Usuarios (admin)
```

**Orden de presentación comercial** (guion §4.9–4.11): Dashboard → Listado → Ficha → Validación → Ranking → Administración.

---

## 2. Flujos por rol interno (variaciones)

| Rol | Flujos habilitados | Restricciones demo |
|-----|---------------------|---------------------|
| **Usuario de consulta** | Dashboard, listado, ficha (sin acciones de aprobación) | Ocultar Validación, Config, Admin usuarios, Biblioteca admin. |
| **Evaluador** | + Validación, Evaluación (captura), Planes (seguimiento) | Sin alta de usuarios globales. |
| **Administrador por área** | + Ranking, reportes; mock “solicitar evaluadores” | Config global solo lectura o parcial. |
| **Administrador global** | + Config documental, usuarios/roles, biblioteca admin | Ranking y evaluación visibles. |

Los flujos son los mismos; cambian **entradas de menú** y **botones** en ficha/validación.

---

## 3. Breadcrumbs recomendados

| Contexto | Ejemplo |
|----------|---------|
| Interno — ficha | `Inicio / Proveedores / {Nombre} / Ficha 360` |
| Interno — validación | `Inicio / Validación documental` |
| Interno — evaluación | `Inicio / Evaluación / {Proveedor}` |
| Interno — planes | `Inicio / Planes de mejora / {Id}` |
| Proveedor — documentos | `Inicio / Mis documentos` |
| Registro | `Registro de proveedor / Paso {n} de 5 — {título}` |

En **dashboard** y **home proveedor** el breadcrumb puede omitirse o ser solo “Inicio”.

---

## 4. Wizard y stepper (especificidad)

### 4.1 Alta proveedor potencial

- Componente: stepper horizontal o vertical fijo bajo header del `RegistrationLayout`.  
- Pasos: Datos → Clasificación → Cuestionario → Documentos → Confirmación.  
- **Validación:** campos mínimos FR-09 antes de avanzar del paso 1; cuestionario dependiente de clasificación (FR-10, FR-11).  
- **Carga documental:** lista con estados Pendiente / Cargado (mock); CTA “Simular carga” si no hay backend.

### 4.2 Evaluación por fases (interno y/o proveedor lectura)

- Tres bloques: Potencial, Funcionamiento actual, Capacidad estratégica (FR-40).  
- En captura interna: tabs o stepper + resumen con score 0–100 y semáforo (FR-43, FR-44).  
- Proveedor: vista lectura con mismas fases colapsadas y histórico por periodo.

### 4.3 Regularización documental (si se muestra en demo)

- Solo si hay narrativa de “proveedor con documentos vencidos”: wizard corto desde alerta del home → lista de docs → carga → confirmación.

---

## 5. CTA primario por tipo de pantalla

| Tipo | CTA primario típico | Secundario |
|------|---------------------|------------|
| Landing | “Quiero ser proveedor” o “Soy proveedor” (definir orden según negocio; guion presenta ambos) | “Acceso empleados EMPRESA” |
| Login | Iniciar sesión | Recuperar contraseña |
| Home proveedor | Resolver pendiente principal (ej. “Subir documentos pendientes”) | Ver expediente |
| Listado documentos | Subir / Reemplazar en primer doc pendiente | Volver a home |
| Ficha 360 interna | “Abrir validación” o “Ver expediente” según contexto demo | Capturar evaluación |
| Dashboard | “Ver proveedores” o “Ir a validación” según KPI más crítico | Exportar (reportes) |

---

## 6. Secuencia ideal de clics (alineación guion §7)

| Escena | Secuencia |
|--------|-----------|
| 1 | Landing → explicar dos CTAs |
| 2 | Quiero ser proveedor → 5 pasos wizard → confirmación |
| 3 | Soy proveedor → login → home → expediente → documentos → evaluación → planes → biblioteca |
| 4 | Login empresa → dashboard → listado → ficha → validación → ranking → administración |

Esta tabla debe usarse como checklist en `demo-readiness-check.md` (Fase 5).

---

## 7. Componentes sugeridos por tipo de pantalla (reutilizando `wf-*`)

| Tipo | Componentes |
|------|----------------|
| Landing | Hero, dos botones grandes, bloque “¿Eres de EMPRESA?” |
| Tablas operativas | `wf-table`, filtros `wf-filters`, chips de estado |
| Ficha 360 | Grid de cards (cumplimiento, score, alertas, planes) + acciones |
| Wizard | Stepper + form groups `wf-form-*` + barra inferior fija |
| Dashboard | `wf-kpi-row`, gráficas existentes, enlaces a listados |

---

## Relación con otros documentos

- Rutas concretas y guards: `rutas-propuestas.md`.  
- Validación crítica vs FR: `validacion-arquitectura.md`.
