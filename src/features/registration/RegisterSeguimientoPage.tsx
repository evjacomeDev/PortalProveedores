import { Link, useParams } from "react-router-dom";
import { db } from "../../mock/db";

export function RegisterSeguimientoPage() {
  const { id = "demo" } = useParams();

  return (
    <div className="wf-page min-h-screen bg-[#f5f5f5] px-4 py-12">
      <div className="mx-auto max-w-lg wf-card">
        <h1 className="wf-page-title text-xl">Estatus de solicitud</h1>
        <p className="mb-4 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Folio simulado: <strong>{id}</strong> (FR-15)
        </p>
        <p className="mb-6 text-sm">
          Su solicitud se encuentra en <span className="wf-chip wf-chip-validating">En revisión</span>. Le notificaremos por correo cuando haya novedades.
        </p>
        <Link className="wf-btn wf-btn-primary inline-flex no-underline" to="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
