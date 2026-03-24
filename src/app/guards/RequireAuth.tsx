import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";

type RequireAuthProps = {
  /** Si no hay sesión, a dónde redirigir (demo: landing o login contextual). */
  redirectTo?: string;
};

export function RequireAuth({ redirectTo = "/" }: RequireAuthProps) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}
