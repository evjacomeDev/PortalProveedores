import type { BusinessRole, Role } from "../mock/types";

/** Mapeo técnico demo → rol de negocio para menú y guards de alto nivel. */
export function getBusinessRole(role: Role): BusinessRole {
  switch (role) {
    case "PA":
    case "PU":
      return "PROVEEDOR";
    case "TI":
      return "CONSULTA";
    case "VR":
      return "EVALUADOR";
    case "CO":
      return "ADMIN_AREA";
    case "AP":
    case "AC":
      return "ADMIN_GLOBAL";
    default:
      return "CONSULTA";
  }
}
