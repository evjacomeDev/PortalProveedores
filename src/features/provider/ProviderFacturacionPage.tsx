import { Link } from "react-router-dom";
import { db } from "../../mock/db";

export function ProviderFacturacionPage() {
  const url = db.demoConfig.billingUrl;

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Facturación</strong>
      </div>
      <h1 className="wf-page-title">Liga de facturación</h1>
      <p className="mb-6 max-w-2xl text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Enlace configurable (FR-81–82). En demo abre una URL de ejemplo en nueva pestaña.
      </p>
      <div className="wf-card max-w-xl">
        <p className="mb-4 break-all text-sm">{url}</p>
        <a className="wf-btn wf-btn-primary inline-flex no-underline" href={url} target="_blank" rel="noreferrer">
          Abrir portal de facturación
        </a>
      </div>
      <div className="mt-8">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/proveedor/home">
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
