# GAP 4 — RBAC Multi-Área, Menú Dinámico y Gestión de Usuarios
## Portal de Proveedores EMPRESA · Sprint demo
**Stack:** React 19 · Vite · TypeScript · React Router v7 · Zustand · Sonner · Tailwind CSS 4

---

## CONTEXTO

Repo `evjacomeDev/PortalProveedores`. Demo navegable con datos mock.
Convenciones:
- Estilos: clases `wf-*` de `src/styles/wireframe.css`
- Mock: `src/mock/db.ts` + `src/mock/api.ts`
- Tipos en `src/mock/types.ts`
- `toast.success/error()` de `sonner`

---

## ESTADO ACTUAL

### `src/mock/types.ts`
```typescript
export type Role = "AG" | "CO" | "CA" | "ID" | "FI" | "CS" | "PA" | "PU";
export type BusinessRole = "ADMIN_GLOBAL" | "ADMIN_AREA" | "EVALUADOR" | "CONSULTA" | "PROVEEDOR";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Activo" | "Inactivo";
  supplierId?: string;
  // ← NO tiene areas[], lastLogin
};
```

### `src/app/roleMapping.ts`
```typescript
export function getBusinessRole(role: Role): BusinessRole { /* mapeo simple */ }
// ← NO tiene getAllowedMenuItems ni lógica de menú
```

### `src/app/layout/AppShell.tsx`
```typescript
// La función showInternalNav YA existe y YA filtra por rol:
function showInternalNav(role: Role | undefined, key: NavKey): boolean { /* ... */ }
// El sidebar YA usa items filtrados: const items = navDef.filter(...)
// ← Solo falta: mostrar nombre/rol en sidebar + badge de rol de negocio
```

### `src/features/users/UsersPage.tsx`
```tsx
// Tabla existente con columnas: Nombre, Correo, Rol, Estatus, Proveedor
// Botón "Nuevo usuario" decorativo
// Botón "Editar" decorativo
// ← NO tiene: áreas, modal funcional, filtros, funciones CRUD
```

### `src/mock/db.ts` — usuarios actuales
```typescript
users: [
  { id: "u1", name: "Admin Global", email: "ag@demo.com", role: "AG", status: "Activo" },
  { id: "u2", name: "Evaluador Compras", email: "compras@demo.com", role: "CO", status: "Activo" },
  { id: "u3", name: "Evaluador Calidad", email: "calidad@demo.com", role: "CA", status: "Activo" },
  { id: "u4", name: "Evaluador I+D", email: "id@demo.com", role: "ID", status: "Activo" },
  { id: "u5", name: "Evaluador Finanzas", email: "finanzas@demo.com", role: "FI", status: "Activo" },
  { id: "u6", name: "Consulta General", email: "cons@demo.com", role: "CS", status: "Activo" },
  { id: "u7", name: "Proveedor Admin", email: "pa@demo.com", role: "PA", status: "Activo", supplierId: "s1" },
]
```

---

## CAMBIOS REQUERIDOS

### PASO 1 — `src/mock/types.ts`

Agrega `areas` y `lastLogin` a `User`:

```typescript
export const AREA_OPTIONS = ["Compras", "Calidad", "I+D", "Finanzas", "Administración"] as const;
export type Area = typeof AREA_OPTIONS[number];

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  areas: Area[];          // NUEVO — puede ser [] para proveedor/consulta
  status: "Activo" | "Inactivo";
  supplierId?: string;
  lastLogin?: string;     // NUEVO — ISO date string
};
```

### PASO 2 — `src/mock/db.ts`

Actualiza usuarios existentes agregando `areas` y `lastLogin`. Agrega 2 usuarios multi-área:

```typescript
users: [
  { id: "u1", name: "Admin Global", email: "ag@demo.com", role: "AG",
    areas: ["Administración"], status: "Activo", lastLogin: "2026-03-24T08:00:00Z" },
  { id: "u2", name: "Evaluador Compras", email: "compras@demo.com", role: "CO",
    areas: ["Compras"], status: "Activo", lastLogin: "2026-03-23T14:30:00Z" },
  { id: "u3", name: "Evaluador Calidad", email: "calidad@demo.com", role: "CA",
    areas: ["Calidad"], status: "Activo", lastLogin: "2026-03-22T09:15:00Z" },
  { id: "u4", name: "Evaluador I+D", email: "id@demo.com", role: "ID",
    areas: ["I+D"], status: "Activo", lastLogin: "2026-03-20T16:00:00Z" },
  { id: "u5", name: "Evaluador Finanzas", email: "finanzas@demo.com", role: "FI",
    areas: ["Finanzas"], status: "Activo", lastLogin: "2026-03-21T11:00:00Z" },
  { id: "u6", name: "Consulta General", email: "cons@demo.com", role: "CS",
    areas: [], status: "Activo", lastLogin: "2026-03-18T10:00:00Z" },
  { id: "u7", name: "Proveedor Admin", email: "pa@demo.com", role: "PA",
    areas: [], status: "Activo", supplierId: "s1", lastLogin: "2026-03-24T07:45:00Z" },
  // NUEVOS — usuarios multi-área:
  { id: "u8", name: "Gerente Compras-Calidad", email: "ger.co.ca@demo.com", role: "CO",
    areas: ["Compras", "Calidad"], status: "Activo", lastLogin: "2026-03-23T13:00:00Z" },
  { id: "u9", name: "Analista Compras-Finanzas", email: "an.co.fi@demo.com", role: "CO",
    areas: ["Compras", "Finanzas"], status: "Activo", lastLogin: "2026-03-22T17:00:00Z" },
],
```

### PASO 3 — `src/mock/api.ts`

Agrega funciones CRUD de usuarios:

```typescript
export async function createUser(
  payload: Omit<User, "id" | "lastLogin"> & { password?: string }
) {
  await delay();
  // Validar email único
  if (db.users.some((u) => u.email === payload.email)) {
    throw new Error("El correo ya está en uso");
  }
  const newUser: User = {
    ...payload,
    id: id("usr"),
    lastLogin: undefined,
  };
  db.users.push(newUser);
  audit("user_create", `Usuario creado: ${newUser.name} (${newUser.role}) — áreas: ${newUser.areas.join(", ") || "ninguna"}`);
  return newUser;
}

export async function updateUser(
  userId: string,
  updates: Partial<Pick<User, "name" | "email" | "role" | "areas" | "status">>
) {
  await delay();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("Usuario no encontrado");
  // Validar email único si cambió
  if (updates.email && updates.email !== user.email) {
    if (db.users.some((u) => u.email === updates.email)) {
      throw new Error("El correo ya está en uso");
    }
  }
  Object.assign(user, updates);
  audit("user_update", `Usuario actualizado: ${user.name}`);
  return user;
}

export async function toggleUserStatus(userId: string) {
  await delay();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("Usuario no encontrado");
  user.status = user.status === "Activo" ? "Inactivo" : "Activo";
  audit("user_status", `${user.name} → ${user.status}`);
  return user;
}
```

### PASO 4 — `src/app/roleMapping.ts`

Agrega función `getRoleLabel` para mostrar en UI y mejora el export:

```typescript
import type { BusinessRole, Role } from "../mock/types";

// Existente — no cambiar:
export function getBusinessRole(role: Role): BusinessRole { /* ... */ }

// NUEVO:
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    AG: "Admin Global",
    CO: "Admin Área",
    CA: "Evaluador Calidad",
    ID: "Evaluador I+D",
    FI: "Evaluador Finanzas",
    CS: "Consulta",
    PA: "Proveedor Admin",
    PU: "Proveedor Usuario",
  };
  return labels[role] ?? role;
}

export function getBusinessRoleLabel(role: Role): string {
  const br = getBusinessRole(role);
  const labels: Record<BusinessRole, string> = {
    ADMIN_GLOBAL: "Administrador Global",
    ADMIN_AREA: "Administrador de Área",
    EVALUADOR: "Evaluador",
    CONSULTA: "Solo Consulta",
    PROVEEDOR: "Proveedor",
  };
  return labels[br];
}
```

### PASO 5 — `src/app/layout/AppShell.tsx`

Actualiza el sidebar para mostrar info del usuario y badge de rol:

El `AppShell` ya tiene `showInternalNav` y el menú filtrado funcionando. Solo necesita:

1. En el `<aside>`, **arriba** del `<nav>`, agrega un bloque de perfil del usuario:
```tsx
// Dentro del <aside>, antes del <nav>:
<div className="p-3 border-b" style={{ borderColor: "var(--wf-border)" }}>
  <p className="text-sm font-bold truncate">{user?.name}</p>
  <span className="wf-chip wf-chip-validating text-xs mt-1 inline-block">
    {getRoleLabel(user?.role as Role)}
  </span>
  {/* Áreas del usuario (si tiene) */}
  {user && (user as any).areas?.length > 0 && (
    <div className="flex flex-wrap gap-1 mt-1">
      {(user as any).areas.map((area: string) => (
        <span key={area} className="text-xs px-1 py-0.5 rounded"
          style={{ background: "var(--wf-bg-muted)", color: "var(--wf-text-muted)", fontSize: "10px" }}>
          {area}
        </span>
      ))}
    </div>
  )}
</div>
```

2. Importa `getRoleLabel` y `type Role` desde `../app/roleMapping` y `../mock/types` respectivamente.

> Nota: `useAuthStore` ya retorna `user`. Si el tipo de `user` en el store no incluye `areas[]`, hace cast temporal `(user as any).areas` para la demo.

### PASO 6 — `src/features/users/UsersPage.tsx`

Reescribe completamente:

```tsx
import { useState } from "react";
import { toast } from "sonner";
import { createUser, updateUser, toggleUserStatus } from "../../mock/api";
import { db } from "../../mock/db";
import { getRoleLabel } from "../../app/roleMapping";
import type { Role, User, Area } from "../../mock/types";
import { AREA_OPTIONS } from "../../mock/types";

const ROLES: { value: Role; label: string }[] = [
  { value: "AG", label: "Admin Global" },
  { value: "CO", label: "Admin Área" },
  { value: "CA", label: "Evaluador Calidad" },
  { value: "ID", label: "Evaluador I+D" },
  { value: "FI", label: "Evaluador Finanzas" },
  { value: "CS", label: "Solo Consulta" },
];

type UserForm = {
  name: string;
  email: string;
  role: Role;
  areas: Area[];
  status: "Activo" | "Inactivo";
  password: string;
};

const EMPTY_FORM: UserForm = {
  name: "", email: "", role: "CS", areas: [], status: "Activo", password: "demo1234",
};

export function UsersPage() {
  const [users, setUsers] = useState([...db.users]);
  const [filterRole, setFilterRole] = useState<Role | "Todos">("Todos");
  const [filterArea, setFilterArea] = useState<Area | "Todos">("Todos");
  const [modal, setModal] = useState<{ open: boolean; editId?: string; form: UserForm }>({
    open: false, form: { ...EMPTY_FORM },
  });
  const [saving, setSaving] = useState(false);

  // Filtrado
  const filtered = users.filter((u) => {
    const roleOk = filterRole === "Todos" || u.role === filterRole;
    const areaOk = filterArea === "Todos" || (u.areas ?? []).includes(filterArea);
    return roleOk && areaOk;
  });

  function openNew() {
    setModal({ open: true, form: { ...EMPTY_FORM } });
  }

  function openEdit(u: User) {
    setModal({
      open: true,
      editId: u.id,
      form: {
        name: u.name, email: u.email, role: u.role,
        areas: u.areas ?? [], status: u.status, password: "",
      },
    });
  }

  function closeModal() {
    setModal({ open: false, form: { ...EMPTY_FORM } });
  }

  async function handleSave() {
    if (!modal.form.name.trim() || !modal.form.email.trim()) {
      toast.error("Nombre y correo son requeridos");
      return;
    }
    setSaving(true);
    try {
      if (modal.editId) {
        await updateUser(modal.editId, {
          name: modal.form.name,
          email: modal.form.email,
          role: modal.form.role,
          areas: modal.form.areas,
          status: modal.form.status,
        });
        toast.success("Usuario actualizado");
      } else {
        await createUser({
          name: modal.form.name,
          email: modal.form.email,
          role: modal.form.role,
          areas: modal.form.areas,
          status: modal.form.status,
          password: modal.form.password,
        });
        toast.success("Usuario creado");
      }
      setUsers([...db.users]);
      closeModal();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(u: User) {
    await toggleUserStatus(u.id);
    setUsers([...db.users]);
    toast.success(`${u.name} → ${u.status === "Activo" ? "Inactivo" : "Activo"}`);
  }

  function toggleArea(area: Area) {
    const current = modal.form.areas;
    const next = current.includes(area) ? current.filter((a) => a !== area) : [...current, area];
    setModal((m) => ({ ...m, form: { ...m.form, areas: next } }));
  }

  return (
    <>
      <h1 className="wf-page-title">Gestión de usuarios y perfiles</h1>

      {/* Filtros */}
      <div className="wf-filters mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="wf-label">Rol</label>
          <select className="wf-input" value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Role | "Todos")}>
            <option value="Todos">Todos los roles</option>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label className="wf-label">Área</label>
          <select className="wf-input" value={filterArea}
            onChange={(e) => setFilterArea(e.target.value as Area | "Todos")}>
            <option value="Todos">Todas las áreas</option>
            {AREA_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <button type="button" className="wf-btn wf-btn-primary" onClick={openNew}>
          + Nuevo usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Áreas</th>
                <th>Último acceso</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td className="text-sm">{u.email}</td>
                  <td>
                    <span className="wf-chip wf-chip-validating text-xs">
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(u.areas ?? []).length > 0
                        ? (u.areas ?? []).map((a) => (
                            <span key={a} className="wf-chip wf-chip-preregistered text-xs">{a}</span>
                          ))
                        : <span className="text-xs" style={{ color: "var(--wf-text-muted)" }}>—</span>
                      }
                    </div>
                  </td>
                  <td className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleDateString("es-MX")
                      : "—"
                    }
                  </td>
                  <td>
                    <span className={u.status === "Activo" ? "wf-chip wf-chip-active" : "wf-chip wf-chip-inactive"}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button type="button" className="wf-action-btn" onClick={() => openEdit(u)}>
                        Editar
                      </button>
                      <button type="button" className="wf-action-btn" onClick={() => handleToggle(u)}>
                        {u.status === "Activo" ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-sm"
                  style={{ color: "var(--wf-text-muted)" }}>Sin usuarios con estos filtros</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="wf-card w-full max-w-md mx-4 space-y-4">
            <h2 className="text-base font-bold">
              {modal.editId ? "Editar usuario" : "Nuevo usuario"}
            </h2>

            <div>
              <label className="wf-label">Nombre completo *</label>
              <input className="wf-input w-full" value={modal.form.name}
                onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, name: e.target.value } }))} />
            </div>

            <div>
              <label className="wf-label">Correo electrónico *</label>
              <input type="email" className="wf-input w-full" value={modal.form.email}
                onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, email: e.target.value } }))} />
            </div>

            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="wf-label">Rol</label>
                <select className="wf-input" value={modal.form.role}
                  onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, role: e.target.value as Role } }))}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="wf-label">Estatus</label>
                <select className="wf-input" value={modal.form.status}
                  onChange={(e) => setModal((m) => ({
                    ...m, form: { ...m.form, status: e.target.value as "Activo" | "Inactivo" }
                  }))}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="wf-label">Áreas asignadas (puede seleccionar varias)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AREA_OPTIONS.map((area) => (
                  <label key={area} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" checked={modal.form.areas.includes(area)}
                      onChange={() => toggleArea(area)} />
                    {area}
                  </label>
                ))}
              </div>
            </div>

            {!modal.editId && (
              <div>
                <label className="wf-label">Contraseña inicial</label>
                <input type="text" className="wf-input w-full" value={modal.form.password}
                  onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, password: e.target.value } }))} />
                <p className="text-xs mt-1" style={{ color: "var(--wf-text-muted)" }}>
                  Solo demo — no se guarda en backend real.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="wf-btn wf-btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="button" className="wf-btn wf-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando…" : modal.editId ? "Actualizar" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## TAREA ADICIONAL — Terminología

Busca y reemplaza en **todos los archivos** que contengan el título "Portal REPSE":

| Antes | Después |
|-------|---------|
| `Portal REPSE` (en títulos `<h1>`, headers de layout) | `Portal de Proveedores` |
| `Portal de Proveedores REPSE` (en `AppShell`, `ProviderShell`) | `Portal de Proveedores` |

Excepciones — **NO renombrar** en:
- Rutas `/proveedor/operacion/*`
- Módulo `ExpedientePage`, `PeriodsPage`, `ContractsPage`
- Variables de código como `repseDocument`, `repse-demo`

---

## CRITERIO DE ACEPTACIÓN

1. Login `ag@demo.com` → sidebar muestra nombre + badge "Admin Global" + área "Administración"
2. Login `compras@demo.com` → sidebar muestra su nombre + "Admin Área" + área "Compras" → menú **no** muestra "Usuarios" ni "Biblioteca (admin)"
3. Login `cons@demo.com` → sidebar muestra "Solo Consulta" → menú solo Dashboard, Proveedores, Ranking, Reportes
4. `/app/admin/usuarios` → tabla con columna Áreas, filtros por rol y área funcionan
5. Crear usuario con 2 áreas → aparece en tabla con 2 chips de área
6. Editar usuario → cambio persiste en tabla
7. Desactivar usuario → badge cambia a Inactivo + entrada en bitácora
8. `npx tsc --noEmit` sin errores
