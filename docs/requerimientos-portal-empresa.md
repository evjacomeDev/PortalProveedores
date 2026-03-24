# Requerimientos funcionales - Portal de Proveedores EMPRESA

## 1. Propósito del demo

Este documento define los requerimientos funcionales mínimos y prioritarios para reconstruir una demo navegable de un **Portal de Proveedores para EMPRESA**.

La intención del demo es representar una solución de negocio convincente para mostrar al cliente, basada en flujos reales de operación y no en pantallas aisladas.

La demo debe tomar como referencia visual los wireframes HTML existentes del portal REPSE, pero debe adaptarse a un **portal general de gestión de proveedores**, incluyendo proveedor potencial, proveedor activo y usuarios internos de EMPRESA.

---

## 2. Objetivo general del portal

Construir un portal web que permita a EMPRESA gestionar de manera centralizada:

- el registro de proveedores actuales y potenciales
- la gestión documental legal, fiscal y técnica
- la evaluación de desempeño de proveedores
- el seguimiento a planes de mejora
- la visualización de indicadores y rankings
- la administración de usuarios, roles y configuraciones
- la comunicación y consulta documental entre EMPRESA y sus proveedores

---

## 3. Alcance funcional del demo

La demo debe cubrir tres experiencias principales:

1. **Visitante público**
2. **Proveedor activo**
3. **Usuario interno EMPRESA**

Adicionalmente, debe contemplar variaciones por rol interno:
- Administrador global
- Administrador por área
- Evaluador
- Usuario de consulta

---

## 4. Principios de diseño para la demo

La demo debe cumplir estos principios:

- la navegación debe sentirse como flujo de negocio, no como colección de pantallas
- cada rol debe ver una navegación distinta
- debe existir una entrada pública al portal
- los procesos largos deben resolverse con wizard o stepper
- cada pantalla debe tener un CTA primario claro
- la demo debe usar datos mock consistentes entre módulos
- la experiencia demo tiene prioridad sobre backend real
- el diseño debe conservar una estética cercana a los wireframes HTML existentes

---

## 5. Flujos principales obligatorios

## 5.1 Flujo público
Landing pública  
→ Soy proveedor  
→ Login  
→ Home proveedor

Landing pública  
→ Quiero ser proveedor  
→ Registro inicial  
→ Clasificación  
→ Cuestionario  
→ Carga documental inicial  
→ Confirmación / estatus

## 5.2 Flujo proveedor activo
Home proveedor  
→ Mi expediente  
→ Mis documentos  
→ Subir / reemplazar documentos  
→ Resultado de validación  
→ Mi evaluación  
→ Resultado / score / semáforo  
→ Planes de mejora  
→ Biblioteca PDF  
→ Facturación

## 5.3 Flujo usuario interno EMPRESA
Login interno  
→ Dashboard  
→ Listado de proveedores  
→ Ficha 360  
→ Validación documental  
→ Evaluación  
→ Ranking  
→ Planes de mejora  
→ Configuración  
→ Usuarios y roles

---

## 6. Requerimientos funcionales

## 6.1 Acceso público y autenticación

### FR-01
El portal debe mostrar una **landing pública inicial** accesible sin autenticación.

### FR-02
La landing pública debe mostrar dos opciones principales:
- **Soy proveedor**
- **Quiero ser proveedor**

### FR-03
Al seleccionar **Soy proveedor**, el usuario debe ser dirigido a la pantalla de login.

### FR-04
Al seleccionar **Quiero ser proveedor**, el usuario debe ser dirigido al flujo de registro inicial como proveedor potencial.

### FR-05
El portal debe permitir autenticación por usuario y contraseña para proveedores activos.

### FR-06
El portal debe contemplar recuperación o restablecimiento de contraseña.

### FR-07
El portal debe contemplar autenticación para usuarios internos de EMPRESA.

---

## 6.2 Registro de proveedor potencial

### FR-08
El portal debe permitir el registro inicial de proveedores potenciales.

### FR-09
El registro inicial debe capturar datos generales del proveedor potencial, al menos:
- razón social
- RFC
- nombre comercial
- contacto principal
- correo
- teléfono
- tipo de producto o servicio

### FR-10
El portal debe permitir clasificar al proveedor por tipo de producto o servicio.

### FR-11
Según la clasificación, el sistema debe dirigir al proveedor a un cuestionario específico.

### FR-12
El flujo de alta debe permitir la carga inicial de documentos requeridos.

### FR-13
El sistema debe dejar el registro del proveedor potencial en un estatus controlado, por ejemplo:
- Capturado
- En revisión
- Pendiente de información
- Aprobado
- Rechazado

### FR-14
El sistema debe notificar al área interna responsable cuando exista una nueva solicitud de alta.

### FR-15
El proveedor potencial debe poder consultar el estatus de su solicitud.

---

## 6.3 Home del proveedor activo

### FR-16
El portal debe mostrar un home del proveedor con resumen de:
- alertas
- pendientes documentales
- vencimientos próximos
- score actual
- notificaciones
- plan de mejora activo
- accesos rápidos relevantes

### FR-17
El home del proveedor debe mostrar acceso a:
- mi expediente
- mis documentos
- mi evaluación
- planes de mejora
- políticas y tutoriales
- liga de facturación

### FR-18
El home debe funcionar como hub de tareas y pendientes, no solo como vista informativa.

---

## 6.4 Perfil, expediente y ficha del proveedor

### FR-19
El portal debe mostrar un perfil del proveedor con información general, contactos, categoría y estatus.

### FR-20
El portal debe contar con una vista de **expediente digital** para consultar documentos, vigencias, observaciones e histórico.

### FR-21
El portal debe contar con una vista tipo **Ficha 360** para usuarios internos con:
- resumen general
- cumplimiento documental
- score
- evaluaciones
- alertas
- planes de mejora
- actividad reciente

### FR-22
El sistema debe permitir actualización de datos del proveedor de acuerdo con permisos.

---

## 6.5 Gestión documental

### FR-23
El portal debe gestionar documentos en al menos dos bloques:
- documentos de empresa
- documentos técnicos

### FR-24
El sistema debe permitir configurar tipos de documento, obligatoriedad, vigencia, formato permitido y tamaño máximo.

### FR-25
Los formatos permitidos deben incluir al menos PDF.

### FR-26
El tamaño máximo por archivo debe ser configurable por el administrador global.

### FR-27
El sistema debe permitir carga de documentos legales, fiscales y técnicos.

### FR-28
Cada documento debe mostrar:
- nombre
- categoría
- fecha de carga
- vigencia
- estatus
- observaciones
- versión

### FR-29
El sistema debe soportar versionamiento documental e histórico de cambios.

### FR-30
El proveedor debe poder reemplazar documentos rechazados o vencidos.

### FR-31
Los usuarios internos autorizados deben poder revisar, aprobar o rechazar documentos.

### FR-32
Los estados documentales mínimos deben ser:
- Pendiente
- Cargado
- En revisión
- Aprobado
- Rechazado
- Vencido

### FR-33
El expediente y el dashboard deben reflejar de forma consistente el estatus documental del proveedor.

---

## 6.6 Biblioteca de políticas, reglamentos y tutoriales

### FR-34
El portal debe incluir una sección de consulta de:
- políticas
- reglamentos
- tutoriales

### FR-35
Los documentos de esta biblioteca deben cargarse al menos en formato PDF.

### FR-36
La biblioteca debe ser configurable y no estar limitada a un número fijo de archivos.

### FR-37
Los usuarios administradores deben poder:
- dar de alta documentos
- editar metadatos
- publicar
- despublicar
- eliminar

### FR-38
Los proveedores deben poder visualizar o descargar estos documentos.

---

## 6.7 Evaluación de desempeño

### FR-39
El portal debe gestionar una evaluación de desempeño de proveedores.

### FR-40
La evaluación debe contemplar tres fases:
- potencial
- funcionamiento actual
- capacidad estratégica

### FR-41
Cada fase debe componerse de criterios o preguntas ponderadas.

### FR-42
El sistema debe calcular automáticamente la calificación final del proveedor con base en pesos por criterio y fase.

### FR-43
La calificación final debe expresarse en una escala de 0 a 100.

### FR-44
El portal debe mostrar la calificación mediante:
- porcentaje
- semáforo, badge o indicador visual

### FR-45
El proveedor debe poder consultar su score actual e histórico.

### FR-46
Los usuarios internos deben poder consultar score, histórico y detalle por fase.

### FR-47
El sistema debe mostrar ranking de proveedores para usuarios internos.

### FR-48
El ranking debe poder visualizarse al menos por categoría.

### FR-49
La evaluación debe ejecutarse automáticamente con frecuencia anual para proveedores activos.

### FR-50
Cuando un proveedor tenga score menor a 70, la frecuencia mock del proceso debe cambiar a semestral.

### FR-51
El sistema debe guardar histórico de evaluaciones por proveedor y por periodo.

---

## 6.8 Planes de mejora

### FR-52
El portal debe permitir generar planes de mejora derivados de:
- score bajo
- hallazgos documentales
- incumplimientos detectados

### FR-53
Cada plan de mejora debe registrar al menos:
- hallazgo
- acción requerida
- responsable
- fecha compromiso
- estatus

### FR-54
El proveedor debe poder consultar sus planes de mejora.

### FR-55
El proveedor debe poder cargar evidencia de atención.

### FR-56
Los usuarios internos deben poder revisar evidencia, dar seguimiento y cerrar planes.

### FR-57
El sistema debe mostrar el avance y estatus de los planes de mejora.

---

## 6.9 Alertas y notificaciones

### FR-58
El sistema debe generar alertas automáticas por vencimiento documental próximo.

### FR-59
El sistema debe generar alertas por documentos rechazados, pendientes o vencidos.

### FR-60
El sistema debe generar alertas por inicio o seguimiento de evaluación.

### FR-61
El sistema debe generar alertas asociadas a planes de mejora.

### FR-62
El proveedor debe visualizar alertas y notificaciones en su home.

### FR-63
Los usuarios internos deben visualizar alertas operativas en dashboard y fichas de proveedor.

---

## 6.10 Administración por roles

### FR-64
El portal debe soportar administración por roles.

### FR-65
Deben existir al menos los roles:
- Administrador global
- Administrador por área
- Evaluador
- Usuario de consulta
- Proveedor

### FR-66
El sistema debe permitir usuarios multi-área.

### FR-67
Cada rol debe ver únicamente la navegación y acciones que le corresponden.

### FR-68
El Administrador global debe poder gestionar:
- usuarios
- roles
- configuraciones generales
- configuración documental
- biblioteca PDF

### FR-69
Los administradores por área deben poder gestionar o solicitar usuarios evaluadores de su ámbito.

### FR-70
El sistema debe permitir alta, baja, edición, bloqueo y reasignación de usuarios.

---

## 6.11 Comunicación y seguimiento

### FR-71
El portal debe funcionar como canal formal de interacción entre EMPRESA y sus proveedores.

### FR-72
El sistema debe permitir mostrar mensajes, avisos u observaciones relacionados con:
- documentos
- evaluaciones
- aclaraciones
- planes de mejora

### FR-73
El proveedor debe poder consultar el historial de comunicaciones relevantes dentro del portal.

---

## 6.12 Dashboard, listados y analítica

### FR-74
El sistema debe contar con dashboard ejecutivo para usuarios internos.

### FR-75
El dashboard debe mostrar al menos:
- proveedores por estatus
- cumplimiento documental
- documentos vencidos
- evaluaciones pendientes
- ranking resumido
- alertas

### FR-76
El portal debe contar con un listado de proveedores con filtros por:
- nombre
- RFC
- categoría
- estatus
- cumplimiento

### FR-77
Desde el listado debe poder abrirse el detalle del proveedor.

### FR-78
La ficha 360 y el dashboard deben usar datos consistentes con el expediente y las evaluaciones.

### FR-79
La solución demo debe contemplar datos exportables o explotables para indicadores tipo Power BI.

### FR-80
No debe requerirse una base separada para analítica en la demo; los datos mock deben provenir del mismo modelo de información del portal.

---

## 6.13 Facturación y enlaces útiles

### FR-81
El proveedor debe visualizar una liga de facturación en un lugar visible del portal.

### FR-82
La URL de facturación debe ser configurable.

---

## 7. Pantallas mínimas del demo

La demo debe incluir, como mínimo, las siguientes pantallas o vistas:

1. Landing pública
2. Login proveedor
3. Login interno EMPRESA
4. Registro proveedor potencial
5. Clasificación del proveedor potencial
6. Cuestionario por categoría
7. Carga documental inicial
8. Confirmación / estatus de solicitud
9. Home proveedor
10. Mi expediente
11. Mis documentos
12. Modal o vista de carga / reemplazo documental
13. Mi evaluación
14. Detalle de evaluación
15. Planes de mejora proveedor
16. Biblioteca PDF
17. Dashboard interno
18. Listado de proveedores
19. Ficha 360
20. Validación documental interna
21. Ranking
22. Planes de mejora interno
23. Configuración documental
24. Administración de usuarios y roles

---

## 8. Reglas de navegación UX

## 8.1 Navegación por rol
La demo debe tener navegación separada para:
- público
- proveedor
- usuario interno
- administración

## 8.2 Wizard
Los siguientes flujos deben usar wizard o stepper:
- alta de proveedor potencial
- evaluación por fases
- regularización documental si aplica

## 8.3 CTA principal
Cada pantalla debe tener una acción principal clara.

## 8.4 Consistencia
No debe haber pantallas huérfanas o sin salida lógica.

## 8.5 Profundidad de navegación
La acción principal de cada rol debe resolverse en máximo 2 clics desde su home.

---

## 9. Reglas de datos mock

La demo debe usar datos mock consistentes y centralizados.

Debe existir variedad de escenarios, por ejemplo:
- proveedor cumplido
- proveedor con documentos vencidos
- proveedor con score bajo
- proveedor con plan de mejora
- proveedor potencial en revisión

La información mostrada en dashboard, listados, ficha 360, expediente, evaluación y planes debe coincidir entre sí.

---

## 10. Qué reutilizar del prototipo base

Se considera prioritario reutilizar o adaptar, según convenga:
- login
- home proveedor
- expediente
- ficha 360
- carga documental
- dashboards
- listados
- configuración de documentos
- estilos y componentes visuales reutilizables

No se debe forzar la lógica REPSE original si interfiere con el flujo del portal general de proveedores.

---

## 11. Prioridades de reconstrucción

## Prioridad Alta
- navegación por rol
- landing pública
- flujo “Quiero ser proveedor”
- home proveedor
- expediente y documentos
- evaluación
- dashboard interno
- ficha 360
- ranking
- planes de mejora

## Prioridad Media
- biblioteca PDF
- administración de usuarios
- configuración documental
- notificaciones más detalladas
- exportables mock

## Prioridad Baja
- refinamientos secundarios no visibles en demo
- automatizaciones complejas de backend
- integraciones reales

---

## 12. Criterios de éxito del demo

La demo será considerada exitosa si logra:

1. mostrar claramente los 3 journeys principales
2. representar el valor de negocio del portal para EMPRESA
3. demostrar control documental, evaluación y seguimiento
4. mostrar navegación clara, coherente y convincente
5. permitir una presentación fluida frente al cliente
6. mantener consistencia visual con los wireframes base
7. evidenciar una solución madura aunque use datos mock

---

## 13. Instrucción para agentes de desarrollo

Toda propuesta de reconstrucción debe responder a estas preguntas:

- qué se conserva
- qué se adapta
- qué se rehace
- qué se elimina
- qué requerimiento cubre cada pantalla o módulo
- cómo mejora la navegación
- cómo contribuye al storytelling del demo frente al cliente

No se debe construir UI aislada sin justificar el flujo de negocio que resuelve.