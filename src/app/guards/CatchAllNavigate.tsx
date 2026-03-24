import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";

/** Ruta comodín: público → inicio; sesión → home según rol. */
export function CatchAllNavigate() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/" replace />;
  if (user.role === "PA" || user.role === "PU") return <Navigate to="/proveedor/home" replace />;
  return <Navigate to="/app/dashboard" replace />;
}
