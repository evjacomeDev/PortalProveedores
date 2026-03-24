# Prompts Cursor - Módulos funcionales

## Prompt 6 - Módulo Quiero ser proveedor

Implementa el flujo completo Quiero ser proveedor como wizard navegable.

Pantallas:
1. Landing pública con dos opciones:
   - Soy proveedor
   - Quiero ser proveedor

2. Registro inicial de proveedor potencial
   - datos generales
   - contacto
   - tipo de producto/servicio

3. Clasificación
   - selección de categoría
   - condicionamiento del siguiente paso según categoría

4. Cuestionario específico
   - preguntas mock por categoría
   - validaciones básicas
   - guardado temporal mock

5. Carga inicial de documentos
   - lista de documentos requeridos
   - estados visuales
   - carga mock

6. Confirmación y estatus de solicitud
   - resumen de lo capturado
   - estatus En revisión
   - siguiente paso esperado

Reglas UX:
- usar stepper visible
- botones Anterior / Siguiente / Guardar borrador
- mensaje claro de progreso
- diseño consistente con los wireframes

---

## Prompt 7 - Portal del proveedor activo

Reconstruye la experiencia del proveedor activo para que se sienta orientada a tareas y pendientes.

Pantallas clave:
1. Home proveedor
2. Mi expediente
3. Mis documentos
4. Mi evaluación
5. Planes de mejora
6. Biblioteca
7. Acceso a facturación

Requisitos:
- navegación coherente desde el home
- CTA claro en cada vista
- datos mock realistas
- reutilizar componentes útiles ya existentes
- look & feel corporativo similar a wireframes

---

## Prompt 8 - Portal interno EMPRESA

Implementa la experiencia del usuario interno de EMPRESA.

Pantallas mínimas:
1. Dashboard ejecutivo
2. Listado de proveedores
3. Ficha 360 del proveedor
4. Validación documental
5. Ranking
6. Planes de mejora
7. Administración

Reglas:
- la navegación debe sentirse operativa y ejecutiva
- ranking solo visible para usuarios internos
- usar tablas, cards y KPIs claros
- todas las pantallas deben estar conectadas entre sí

---

## Prompt 9 - Evaluación de desempeño

Implementa un módulo demo de evaluación de desempeño de proveedores.

La evaluación debe contemplar 3 fases:
1. potencial
2. funcionamiento actual
3. capacidad estratégica

Necesito:
- vista de cuestionario o checklist por fase
- pesos mock por criterio
- cálculo automático del score final 0-100
- visualización por porcentaje y semáforo
- historial de evaluaciones
- lógica mock de periodicidad:
  - anual para proveedores activos
  - semestral cuando el score sea menor a 70

Además:
- proveedores ven su score y detalle
- usuarios internos ven score, detalle y ranking
- el sistema debe generar datos mock coherentes con esa lógica

---

## Prompt 10 - Mocks y consistencia de datos

Refactoriza la demo para que todos los módulos compartan datos mock consistentes.

Objetivo:
evitar que cada pantalla parezca aislada o con datos contradictorios.

Necesito:
1. un modelo mock centralizado para:
   - proveedores
   - usuarios
   - documentos
   - evaluaciones
   - rankings
   - planes de mejora
   - notificaciones
   - biblioteca PDF

2. relaciones coherentes entre entidades

3. mocks suficientes para mostrar variedad de escenarios:
   - proveedor cumplido
   - proveedor con documentos vencidos
   - proveedor con score bajo
   - proveedor con plan de mejora
   - proveedor potencial en revisión

Genera también `/docs/modelo-mock-demo.md`.