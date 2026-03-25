import type { BusinessRole, Role } from "../mock/types";

/** Mapeo técnico demo → rol de negocio para menú y guards de alto nivel. */
export function getBusinessRole(role: Role): BusinessRole {
  switch (role) {
    case "PA":
    case "PU":
      return "PROVEEDOR";
    case "CS":
      return "CONSULTA";
    case "CA":
    case "ID":
    case "FI":
      return "EVALUADOR";
    case "CO":
      return "ADMIN_AREA";
    case "AG":
      return "ADMIN_GLOBAL";
    default:
      return "CONSULTA";
  }
}
<<<<<<< HEAD
=======

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    AG: "Admin Global",
    CO: "Admin Área",
    CA: "Evaluador Calidad",
    ID: "Evaluador I+D",
    FI: "Evaluador Finanzas",
    CS: "Consulta",
    PA: "Proveedor Admin",
    PU: "Proveedor Usuario",
  };
  return labels[role] ?? role;
}

export function getBusinessRoleLabel(role: Role): string {
  const br = getBusinessRole(role);
  const labels: Record<BusinessRole, string> = {
    ADMIN_GLOBAL: "Administrador Global",
    ADMIN_AREA: "Administrador de Área",
    EVALUADOR: "Evaluador",
    CONSULTA: "Solo Consulta",
    PROVEEDOR: "Proveedor",
  };
  return labels[br];
}
>>>>>>> cfdacd9 (Cierre de demo commit)
