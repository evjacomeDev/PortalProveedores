# Prompts Cursor - Validación final

## Prompt 11 - Readiness para demo comercial

Usa `/docs/guion-demo-cliente.md` para validar que la demo no solo funcione técnicamente, sino que pueda presentarse de forma convincente al cliente.

Genera en `/docs/demo-readiness-check.md`:
- qué partes del guion ya están soportadas por la demo
- qué pantallas o flujos faltan para contar bien la historia
- qué riesgos de presentación existen
- qué ajustes rápidos mejorarían la demostración ante el cliente

Después, prioriza mejoras de alto impacto para que la demo sea más convincente en una reunión comercial.

---

## Prompt 12 - Validación final contra requerimientos

Haz una validación final de la demo contra `/docs/requerimientos-portal-empresa.md`.

Necesito:
1. matriz de cobertura funcional
   - requerimiento
   - pantalla o módulo que lo cubre
   - nivel de cobertura: completo / parcial / no cubierto
   - observaciones

2. lista de gaps restantes
   - funcionales
   - UX
   - navegación
   - datos mock

3. lista de mejoras recomendadas para una siguiente iteración

4. checklist para presentación al cliente
   - qué flujo demo mostrar
   - qué explicar en cada pantalla
   - qué limitaciones declarar como demo

Entrega en:
- `/docs/matriz-cobertura-final.md`
- `/docs/gaps-finales.md`
- `/docs/guion-demo-presentacion-final.md`