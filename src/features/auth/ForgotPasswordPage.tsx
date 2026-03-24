import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
  return (
    <div className="wf-login-frame">
      <div className="wf-login-logo">
        <span className="text-[32px] font-black tracking-tighter" style={{ color: "var(--wf-primary)" }}>Prospectiva</span>
      </div>
      <div className="wf-login-card">
        <h1 className="wf-login-title">Recuperar contraseña</h1>
        <p className="wf-login-subtitle">Solo interfaz de demostración (sin envío real).</p>
        <div className="wf-form-group">
          <label className="wf-form-label" htmlFor="rec-email">
            Correo electrónico
          </label>
          <input id="rec-email" className="wf-form-input" type="email" placeholder="usuario@empresa.com" />
        </div>
        <button type="button" className="wf-btn-login">
          Enviar enlace (demo)
        </button>
        <div className="flex flex-col gap-2 text-center text-sm">
          <Link className="wf-link-muted" to="/login/proveedor">
            Volver a acceso proveedores
          </Link>
          <Link className="wf-link-muted" to="/login/empresa">
            Volver a acceso EMPRESA
          </Link>
          <Link className="wf-link-muted" to="/">
            Ir al inicio público
          </Link>
        </div>
      </div>
    </div>
  );
}
