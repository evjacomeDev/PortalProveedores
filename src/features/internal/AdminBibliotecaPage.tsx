import { Link } from "react-router-dom";
import { db } from "../../mock/db";

export function AdminBibliotecaPage() {
  return (
    <>
      <div className="wf-breadcrumb">
        Inicio / <strong>Administración — Biblioteca PDF</strong>
      </div>
      <h1 className="wf-page-title">Biblioteca PDF (admin)</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Alta, metadatos y publicación (FR-37). Acciones simuladas en demo.
      </p>
      <div className="wf-actions-bar mb-4 justify-start">
        <button type="button" className="wf-btn wf-btn-primary">
          Nuevo documento (demo)
        </button>
      </div>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Publicado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {db.libraryItems.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium">{l.title}</td>
                  <td>{l.category}</td>
                  <td>{l.published ? "Sí" : "No"}</td>
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
      <div className="mt-8">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/app/dashboard">
          Volver al dashboard
        </Link>
      </div>
    </>
  );
}
