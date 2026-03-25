import { useState } from "react";
import { toast } from "sonner";
import { getRoleLabel } from "../../app/roleMapping";
import { createUser, toggleUserStatus, updateUser } from "../../mock/api";
import { db } from "../../mock/db";
import { AREA_OPTIONS } from "../../mock/types";
import type { Area, Role, User } from "../../mock/types";

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
