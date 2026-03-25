import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Role } from "../../mock/types";
import { useAuthStore } from "./store";

const internalRoles: Role[] = ["AG", "CO", "CA", "ID", "FI", "CS"];
const providerRoles: Role[] = ["PA", "PU"];

type Audience = "proveedor" | "empresa";

export function LoginPage({ audience }: { audience: Audience }) {
  const roles = audience === "proveedor" ? providerRoles : internalRoles;
  const defaultRole = audience === "proveedor" ? "PA" : "AG";
  const defaultEmail = audience === "proveedor" ? "pa@demo.com" : "ag@demo.com";

  const [role, setRole] = useState<string>(defaultRole);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("demo");
  const [remember, setRemember] = useState(true);
  const loginByRole = useAuthStore((s) => s.loginByRole);
  const loginByCredentials = useAuthStore((s) => s.loginByCredentials);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const title = useMemo(
    () => (audience === "proveedor" ? "Acceso proveedores" : "Acceso EMPRESA"),
    [audience],
  );

  useEffect(() => {
    if (!user) return;
    if (user.role === "PA" || user.role === "PU") navigate("/proveedor/home", { replace: true });
    else navigate("/app/dashboard", { replace: true });
  }, [user, navigate]);

  return (
    <div className="wf-login-frame">
      <div className="wf-login-logo">
        <img src="/LogoProspectiva.png" alt="Prospectiva" style={{ height: "48px", width: "auto" }} />
      </div>
      <div className="wf-login-card">
        <h1 className="wf-login-title">Portal de Proveedores</h1>
        <p className="wf-login-subtitle">{title} — {audience === "proveedor" ? "Operación y expediente" : "Dashboard y gestión"} (demo)</p>

        <div className="wf-form-group">
          <label className="wf-form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input id="email" className="wf-form-input" type="email" placeholder="usuario@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </div>
        <div className="wf-form-group">
          <label className="wf-form-label" htmlFor="password">
            Contraseña
          </label>
          <input id="password" className="wf-form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>

        <label className="mb-6 flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
          <span className="text-sm" style={{ color: "var(--wf-text-soft)" }}>
            Recordar sesión
          </span>
        </label>

        <button type="button" className="wf-btn-login" onClick={() => loginByCredentials(email, password)}>
          Iniciar sesión
        </button>

        <div className="mb-6 text-center">
          <Link className="wf-link-muted" to="/recuperar-contrasena">
            ¿Olvidó su contraseña?
          </Link>
        </div>

        <div className="wf-login-footer">
          <p className="mb-3 font-bold" style={{ color: "var(--wf-text-muted)" }}>
            Demo — elegir usuario mock
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select className="wf-input flex-1" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Rol demo">
              {roles.map((r) => (
                <option key={r} value={r}>
                  Rol {r}
                </option>
              ))}
            </select>
            <button type="button" className="wf-btn wf-btn-secondary shrink-0" onClick={() => loginByRole(role as Role)}>
              Entrar con rol
            </button>
          </div>
          <p className="mt-4 text-center text-xs" style={{ color: "var(--wf-text-muted)" }}>
            {audience === "proveedor" ? (
              <>
                ¿Es personal de EMPRESA?{" "}
                <Link className="wf-link-muted" to="/login/empresa">
                  Acceso interno
                </Link>
              </>
            ) : (
              <>
                ¿Es proveedor?{" "}
                <Link className="wf-link-muted" to="/login/proveedor">
                  Acceso proveedores
                </Link>
              </>
            )}
            {" · "}
            <Link className="wf-link-muted" to="/">
              Inicio público
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
