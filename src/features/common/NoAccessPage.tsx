import { Link } from "react-router-dom";

export function NoAccessPage() {
  return (
    <div className="wf-page flex min-h-screen items-center justify-center p-6">
      <div className="wf-card max-w-md text-center">
        <h1 className="wf-page-title mb-2">Sin acceso</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Tu rol no tiene permisos para este módulo (RBAC demo).
        </p>
        <Link className="wf-btn wf-btn-primary inline-flex items-center justify-center no-underline" to="/app/dashboard">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
