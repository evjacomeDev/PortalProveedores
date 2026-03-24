# Demo REPSE (Cliente + Proveedor)

Prototipo navegable para mostrar flujos REPSE end-to-end con datos simulados.

## Correr local

```bash
npm install
npm run dev
```

## Login demo y cambio de rol

- Entrar por `http://localhost:5173/login`.
- Puedes iniciar por:
  - Selector de rol mock (`AP`, `AC`, `CO`, `VR`, `TI`, `PA`, `PU`).
  - Email/password fake (ejemplo: `ap@demo.com` / `demo`).
- La sesion se guarda en `localStorage`.

## Rutas principales

- ` /login`
- ` /app/dashboard`
- ` /app/proveedores`
- ` /app/proveedores/:id`
- ` /app/proveedores/:id/contratos`
- ` /app/contratos/:id/periodos`
- ` /app/expediente/:proveedorId/:contratoId/:periodoId`
- ` /app/validacion`
- ` /app/evaluacion`
- ` /app/evaluacion/:proveedorId`
- ` /app/catalogos`
- ` /app/usuarios`
- ` /app/reportes`
- ` /proveedor/home`
- ` /proveedor/documentos`
- ` /proveedor/contratos`
- ` /proveedor/periodos`
- ` /proveedor/expediente/:periodoId`

## Estructura base

- `src/app`: routing, guards y shells.
- `src/features`: pantallas por módulo (`auth`, `dashboard`, `providers`, `contracts`, `periods`, `expediente`, `validation`, `evaluation`, `catalogs`, `users`, `reports`, `provider`, `common`).
- `src/mock`: datos semilla y fake API asincrona.
- `src/styles/wireframe.css`: tokens y clases `wf-*` alineadas a los HTML en `Wireframes/` (header 72px, sidebar 240px, grises, tablas, chips, login).

## Diseño (wireframes)

- La UI del demo sigue la intención visual de `Wireframes/**/*.html` (tipografía Arial, grises, bordes, KPIs, filtros, tablas).
- En **Dashboard** puedes activar *Modo demo: comparar con wireframe HTML*; en `npm run dev` los HTML se sirven desde `/Wireframes/...` vía plugin de Vite.

## Estado actual del prototipo

- Navegacion interna/proveedor con RBAC basico.
- Flujos demo iniciales: alta proveedor, alta contrato, generar periodos, carga/validacion de documentos, evaluacion con historico y export CSV.
- Referencia visual: `Wireframes/` y diagramas en `Diagramas/`.
