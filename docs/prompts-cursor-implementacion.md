# Prompts Cursor - Implementación principal

## Prompt 4 - Reconstrucción de navegación y layouts

Implementa la nueva arquitectura de navegación aprobada usando:
- `/docs/requerimientos-portal-empresa.md`
- `/docs/sitemap-demo.md`
- `/docs/flujos-demo.md`
- `/docs/rutas-propuestas.md`

Objetivo:
reconstruir la demo para que la navegación represente procesos de negocio reales.

Prioridad de implementación:
1. landing pública
2. flujo Quiero ser proveedor
3. home proveedor
4. expediente y documentos
5. dashboard interno
6. ficha 360
7. evaluación
8. ranking
9. planes de mejora
10. administración y biblioteca PDF

Reglas:
- reutiliza componentes existentes cuando aporten valor
- mantén look & feel cercano a los wireframes HTML
- separa layouts por rol
- crea rutas reales y navegables
- evita pantallas muertas
- usa datos mock consistentes
- cada pantalla debe tener CTA principal claro

Al finalizar cada bloque funcional:
- actualiza `/docs/matriz-cobertura-actual.md` o crea `/docs/matriz-cobertura-progreso.md`
- documenta qué requerimientos ya quedaron cubiertos

---

## Prompt 5 - Refactor de rutas por rol

Refactoriza el sistema de rutas para separar claramente las experiencias:
- público
- proveedor potencial
- proveedor activo
- usuario interno EMPRESA
- administración

Necesito:
- layouts distintos por rol
- menús contextuales por rol
- protección mock de rutas
- breadcrumbs donde aplique
- CTAs principales visibles
- rutas placeholder navegables para pantallas aún no finalizadas

Genera también `/docs/rutas-implementadas.md` con:
- ruta
- rol
- pantalla
- propósito
- estado de implementación