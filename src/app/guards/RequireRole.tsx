import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import type { Role } from "../../mock/types";

export function RequireRole({ roles }: { roles: Role[] }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/sin-acceso" replace />;
  return <Outlet />;
}
