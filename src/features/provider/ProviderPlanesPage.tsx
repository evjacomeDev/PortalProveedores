import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderPlanesPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId;
  const planes = db.improvementPlans.filter((p) => p.supplierId === sid);

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Planes de mejora</strong>
      </div>
      <h1 className="wf-page-title">Planes de mejora</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Hallazgos, acciones y fechas compromiso (FR-52–54). Cargue evidencia desde el detalle (demo).
      </p>

      {planes.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
          No hay planes asignados.
        </p>
      ) : (
        <ul className="space-y-3">
          {planes.map((p) => (
            <li key={p.id} className="wf-card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-bold">{p.title}</div>
                <div className="text-xs" style={{ color: "var(--wf-text-muted)" }}>
                  Vence {p.dueDate} · {p.status}
                </div>
              </div>
              <Link className="wf-btn wf-btn-primary shrink-0 no-underline" to={`/proveedor/planes/${p.id}`}>
                Ver detalle
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/proveedor/documentos">
          CTA: ir a documentos
        </Link>
      </div>
    </>
  );
}
