# Análisis UX e Integración de Flujos

**Fecha:** 2026-03-24

## 1. Detección de pantallas débiles y flujos desconectados

1. **Home del Proveedor (`ProviderHomePage`)**: Aunque muestra KPIs de manera clara, carece de un Call to Action (CTA) principal evidente que guíe al proveedor hacia su acción más prioritaria. Las alertas de vencimiento se muestran en una lista de solo lectura sin un botón directo para resolver.
2. **Expediente Digital (`ExpedientePage`)**: Presenta la documentación tabulada, lo cual es correcto operativamente, pero no cuenta con controles directos en la fila (inline) para que el proveedor pueda "Cargar/Reemplazar" o para que el interno pueda "Validar/Rechazar" sin salir de flujo.
3. **Captura de Evaluación (`EvaluationCapturePage`)**: Agrupa todos los criterios (A, B y C) en una sola tabla continua. Esto es repetitivo y abrumador, perdiendo la oportunidad de representar un proceso de negocio estructurado en las 3 fases solicitadas (Potencial, Funcionamiento actual, Capacidad estratégica).
4. **Ranking de Proveedores (`RankingPage`)**: La información es valiosa, pero a nivel de interfaz (UI), el score numérico carece de código de colores o insignias que faciliten la rápida lectura visual del desempeño (Verde, Amarillo, Rojo).

## 2. Propuestas de mejora por pantalla (Reconstrucción UX)

### Fase D: Portal Proveedor Activo (Home / Hub)
- **Bloque de Acción Prioritaria**: Implementar una "Hero alert" dentro del home. Si hay `pending > 0` o un plan de mejora urgente, esa debe ser la acción CTA primaria con un botón destacado.
- **Acciones In-Context**: En el listado de documentos por vencer, cada ítem debe contar con un enlace directo a la vista de carga documental correspondiente.

### Fase E: Expediente Interno
- **Acciones Rápidas (Inline)**: Modificar la tabla del expediente para que, bajo permisos de Rol Interno, los documentos en estatus "En revisión" expongan botones explícitos de "Aprobar" y "Rechazar" y reflejen visualmente el estado inminente del expediente.

### Fase F: Evaluación y Ranking
- **Wizard / Stepper de Evaluación**: Refactorizar la captura inmensa de evaluación en un proceso guiado de 3 pasos (1. Potencial, 2. Funcionamiento, 3. Estrategia). Al llegar al final del wizard, mostrar un resumen del Score proyectado (0 a 100) antes de guardar la versión definitiva.
- **Jerarquía Visual en Ranking**: Traducir el score numérico de la tabla a indicadores semaforizados para resaltar el estado general e identificar velozmente a los proveedores "En Riesgo".

## 3. Estrategia Operativa
Dado que la navegación básica ya existe (Fase A y B), proponemos focalizarnos en inyectar estas reglas interactivas e iniciar la escritura de código en los siguientes componentes:
1. `ProviderHomePage` y `ExpedientePage`
2. `EvaluationCapturePage` y `RankingPage`
