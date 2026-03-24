import type { SupplierStatus } from "../../mock/types";

const supplierClass: Record<SupplierStatus, string> = {
  "Pre-registrado": "wf-chip wf-chip-preregistered",
  Activo: "wf-chip wf-chip-active",
  "En revision": "wf-chip wf-chip-validating",
  "En riesgo": "wf-chip wf-chip-risk",
  Bloqueado: "wf-chip wf-chip-blocked",
  Inactivo: "wf-chip wf-chip-inactive",
};

export function SupplierStatusBadge({ status }: { status: SupplierStatus }) {
  return <span className={supplierClass[status]}>{status}</span>;
}
