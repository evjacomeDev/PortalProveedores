import { Navigate, useParams } from "react-router-dom";

export function RedirectToOperacionExpediente() {
  const { periodoId = "" } = useParams();
  return <Navigate to={`/proveedor/operacion/expediente/${periodoId}`} replace />;
}
