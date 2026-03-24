import { Link } from "react-router-dom";
import { db } from "../../mock/db";

export function ProviderBibliotecaPage() {
  const items = db.libraryItems.filter((l) => l.published);

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Biblioteca</strong>
      </div>
      <h1 className="wf-page-title">Biblioteca PDF</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Políticas, reglamentos y tutoriales (FR-34–35). Descarga simulada en demo.
      </p>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Archivo</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium">{l.title}</td>
                  <td>{l.category}</td>
                  <td className="text-xs">{l.fileName}</td>
                  <td>
                    <button type="button" className="wf-action-btn">
                      Descargar (demo)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <Link className="wf-btn wf-btn-primary no-underline" to="/proveedor/home">
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
