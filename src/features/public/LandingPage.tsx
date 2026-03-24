import { Link } from "react-router-dom";
import { db } from "../../mock/db";

export function LandingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold" style={{ color: "var(--wf-text)" }}>
        Portal de Proveedores
      </h1>
      <p className="mb-10 max-w-2xl text-[15px] leading-relaxed" style={{ color: "var(--wf-text-muted)" }}>
        Un solo punto de entrada para proveedores activos y para quienes desean iniciar su registro con {db.demoConfig.empresaNombre}. La demo muestra flujos de negocio navegables con datos de ejemplo.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="wf-card flex flex-col">
          <h2 className="mb-2 text-lg font-bold">Soy proveedor</h2>
          <p className="mb-6 flex-1 text-sm" style={{ color: "var(--wf-text-soft)" }}>
            Ya tengo registro y deseo ingresar a mi expediente, documentos y evaluación.
          </p>
          <Link className="wf-btn wf-btn-primary inline-flex items-center justify-center no-underline" to="/login/proveedor">
            Iniciar sesión
          </Link>
        </div>
        <div className="wf-card flex flex-col border-2 border-[#333]">
          <h2 className="mb-2 text-lg font-bold">Quiero ser proveedor</h2>
          <p className="mb-6 flex-1 text-sm" style={{ color: "var(--wf-text-soft)" }}>
            Iniciar registro: datos generales, clasificación, cuestionario y documentos iniciales.
          </p>
          <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline" to="/registro">
            Comenzar registro
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-sm" style={{ color: "var(--wf-text-muted)" }}>
        ¿Ya envió su solicitud?{" "}
        <Link className="wf-link-muted font-medium" to="/registro/seguimiento/demo">
          Consultar estatus (demo)
        </Link>
      </p>
    </div>
  );
}
