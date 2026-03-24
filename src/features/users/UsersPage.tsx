import { db } from "../../mock/db";

export function UsersPage() {
  return (
    <>
      <h1 className="wf-page-title">Administración de usuarios y perfiles</h1>
      <div className="wf-actions-bar">
        <button type="button" className="wf-btn wf-btn-secondary">
          Nuevo usuario interno
        </button>
      </div>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estatus</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {db.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="wf-chip wf-chip-validating">{u.role}</span>
                  </td>
                  <td>
                    <span className={u.status === "Activo" ? "wf-chip wf-chip-active" : "wf-chip wf-chip-inactive"}>{u.status}</span>
                  </td>
                  <td>{u.supplierId ?? "—"}</td>
                  <td>
                    <button type="button" className="wf-action-btn">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
