# Validación de arquitectura propuesta

**Fecha:** 2026-03-24  
**Entradas revisadas:** `sitemap-demo.md`, `flujos-demo.md`, `rutas-propuestas.md`  
**Criterio:** `requerimientos-portal-empresa.md` (fuente de verdad funcional)

---

## 1. Cobertura funcional de la arquitectura propuesta

### 1.1 Bien cubierta por la navegación diseñada

| Bloque req. | Evidencia en arquitectura |
|-------------|---------------------------|
| §5.1 Flujo público (landing, dos entradas, login) | Landing `/`, `/login/proveedor`, `/login/empresa`, wizard `/registro/*` |
| §5.2 Flujo proveedor activo (hub → expediente → documentos → evaluación → planes → biblioteca → facturación) | Rutas `/proveedor/*` y CTAs en `flujos-demo.md` |
| §5.3 Flujo interno | Árbol `/app/*` + ranking y planes explícitos |
| §7 Pantallas mínimas (lista 1–24) | Todas tienen ancla de ruta o subruta prevista salvo matices en §2 gaps |
| §8.1 Navegación por rol | Layouts + matriz menú en `rutas-propuestas.md` |
| §8.2 Wizard alta potencial | `RegistrationLayout` + pasos en sitemap |
| §8.3 CTA primario | Tabla en `flujos-demo.md` §5 |
| §8.4 Sin huérfanas | Reglas breadcrumbs y menú; requiere disciplina en placeholders |
| §8.5 ≤2 clics desde home | Explícito en sitemap §5 y flujos; validar al implementar menú proveedor |

### 1.2 Cubierta condicional (depende de implementación Fase 3–4)

| Tema | Condición |
|------|-----------|
| FR-40 tres fases de evaluación | La ruta existe; el modelo de datos y UI deben reflejar fases nominales, no solo A/B/C genéricos. |
| FR-32 estados documentales completos | Rutas de validación/documentos OK; tipos y UI deben incluir Vencido, etc. |
| FR-78 coherencia ficha / expediente / evaluación | Exige `modelo-mock-demo.md` (Fase 4–5), no solo rutas. |
| FR-66 multi-área | No desglosado en sitemap; aceptable en demo v1 como limitación declarada o mock de un solo área. |

---

## 2. Gaps detectados

| ID / tema | Descripción | Acción recomendada |
|-----------|-------------|-------------------|
| **G-01** | **Notificaciones / bandeja** (FR-58–63): la arquitectura no define ruta dedicada “Alertas” o “Centro de notificaciones”; solo home/dashboard. | Añadir opcional `/proveedor/notificaciones` y widget en dashboard, **o** declarar en demo que alertas viven solo en home (aceptable si el guion lo soporta verbalmente). |
| **G-02** | **Comunicaciones / historial** (FR-71–73): sin ruta “Mensajes” o “Historial con EMPRESA”. | Incorporar sección en ficha 360 + pestaña en expediente proveedor, o página `/proveedor/comunicaciones` placeholder Fase 3. |
| **G-03** | **Consulta estatus solicitud** (FR-15): `/registro/seguimiento/:id` marcada opcional. | Incluir en demo mínima un enlace “Ya registré mi solicitud” en landing que lleve a pantalla con token mock fijo para no fallar en sala de ventas. |
| **G-04** | **Login interno vs proveedor**: dos URLs resuelven FR-07/FR-05 pero el usuario podría confundirse si comparte el mismo formulario. | Diferenciar **copy** y quizá color/accento mínimo entre `/login/proveedor` y `/login/empresa`. |
| **G-05** | **Ranking visible para “consulta”**: matriz propone ocultar ranking a consulta; el req. no excluye explícitamente, pero el guion dice ranking para internos. | Mantener exclusión de consulta **o** mostrar ranking solo lectura sin exportar — decidir en implementación y documentar en `rutas-implementadas.md`. |
| **G-06** | **Configuración general** (FR-68 “configuraciones generales”): rutas actuales cubren documentos, usuarios, biblioteca; no hay “settings” globales (plazos, URL facturación). | Añadir `/app/admin/configuracion` o incluir “URL facturación” y periodicidad evaluación en pantalla de config existente. |
| **G-07** | **Evaluación automática anual / semestral** (FR-49–50): no hay ruta de “calendario” o “programación”. | Tratar como **copy + badge** en evaluación/ranking, sin nueva ruta obligatoria. |

---

## 3. Redundancias

| Redundancia | Evaluación | Recomendación |
|-------------|------------|---------------|
| **Dos expedientes** (`/proveedor/expediente` agregado vs `/proveedor/operacion/expediente/:periodoId`) | Riesgo de dos verdades en demo | Unificar narrativa: expediente “general” como vista por defecto; expediente por periodo como drill-down desde “Operación” o desde tabla de documentos. |
| **Login duplicado** (`/login/proveedor` y `/login/empresa`) | Misma página componente con `variant` | Correcto técnicamente; evitar tercera ruta `/login` sin criterio — usar redirect `/login` → `/` o a último tipo usado. |
| **Ficha 360 vs `/app/proveedores/:id/expediente`** | Dos puntos de verdad documental | Ficha debe **enlazar** a expediente interno; datos desde mismo mock (Fase 4–5). |

---

## 4. Pantallas innecesarias o de riesgo

| Pantalla / ruta | Riesgo | Decisión |
|-----------------|--------|----------|
| Demasiadas rutas admin separadas | Complejidad en demo corta | Agrupar bajo “Administración” con subnav en una sola vista tipo tabs si el tiempo apremia. |
| **Operación REPSE completa** (contratos/periodos) | Distrae del mensaje “portal general” | Mantener **solo si** el cliente es el mismo contexto REPSE; si no, ocultar del menú principal y dejar enlace “Avanzado” o quitar en versión pura EMPRESA. |
| Página intermedia vacía entre wizard steps | Fricción | No añadir pasos extra; 5 pasos del req. son suficientes. |

---

## 5. Riesgos de UX

| Riesgo | Mitigación antes/durante implementación |
|--------|----------------------------------------|
| **Usuario pierde el wizard** al recargar | `sessionStorage` + aviso “Borrador guardado” o al menos persistencia mínima del paso. |
| **Catch-all mal configurado** expone rutas internas sin auth | Tests manuales: URL directa `/app/dashboard` sin sesión → flujo claro. |
| **Menú interno sobrecargado** para Admin global | Agrupar “Operación” vs “Administración” con separadores visuales. |
| **Proveedor no encuentra facturación** | Ítem de menú siempre visible “Facturación” (FR-81 lugar visible). |
| **Dos logins confunden en demo** | En landing, etiquetas claras: “Ya soy proveedor registrado” vs “Personal EMPRESA”. |

---

## 6. Ajustes recomendados antes de implementar (priorizados)

1. **Decidir** si el subflujo REPSE (contratos/periodos) permanece en menú principal del proveedor o pasa a “Operación” colapsado — alinear con `guion-demo-cliente.md` y audiencia.  
2. **Añadir** en `rutas-propuestas.md` (en código) una sola fuente de verdad `routeConfig[]` con `{ path, roles, label }` para generar sidebar y evitar drift.  
3. **Implementar** `/registro/seguimiento` mínimo con token fijo `demo` para cerrar FR-15 en narrativa.  
4. **Extender** mock usuario con `businessRole` antes de tocar muchas vistas; evita condicionales dispersos `role === "AP"`.  
5. **Redirect** desde rutas legacy (`/login`, `/app/catalogos`, `/app/usuarios`) el primer día de refactor de rutas para no romper demos grabadas.  
6. **Sincronizar** textos de shell: eliminar “REPSE” del título principal salvo que el subflujo REPSE siga siendo el foco comercial.

---

## 7. Conclusión

La arquitectura propuesta en **sitemap + flujos + rutas** **cubre de forma adecuada** los journeys obligatorios del requerimiento y el guion comercial, con **huecos menores** en notificaciones explícitas, comunicaciones formales y configuración global. Ningún gap listado bloquea el inicio de la **Fase 3** (`prompts-cursor-implementacion.md`) si se aceptan placeholders y se implementan los ajustes **#1–#5** de la sección 6 en las primeras iteraciones.

**Veredicto:** **Aprobada para implementación** con las salvedades anteriores documentadas.

---

## Referencias cruzadas

- Implementación: `prompts-cursor-implementacion.md`  
- Seguimiento de rutas reales: `rutas-implementadas.md` (pendiente Fase 3)
