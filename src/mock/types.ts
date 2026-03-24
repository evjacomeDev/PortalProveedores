export type Role = "AP" | "AC" | "CO" | "VR" | "TI" | "PA" | "PU";

/** Rol de negocio demo (menú y permisos de alto nivel). */
export type BusinessRole = "ADMIN_GLOBAL" | "ADMIN_AREA" | "EVALUADOR" | "CONSULTA" | "PROVEEDOR";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Activo" | "Inactivo";
  supplierId?: string;
};

export type SupplierStatus = "Pre-registrado" | "Activo" | "En revision" | "En riesgo" | "Bloqueado" | "Inactivo";

export type Supplier = {
  id: string;
  name: string;
  type: string;
  status: SupplierStatus;
  createdAt: string;
  shortReview: boolean;
  detailedReview: boolean;
};

export type Contract = {
  id: string;
  supplierId: string;
  society: string;
  service: string;
  startDate: string;
  endDate: string;
  status: "En revision" | "Vigente" | "Vencido";
};

export type Period = {
  id: string;
  contractId: string;
  supplierId: string;
  label: string;
  dueDate: string;
  status: "Abierto" | "En captura" | "En validacion" | "Aprobado" | "Vencido";
};

export type DocumentStatus = "Pendiente" | "Cargado" | "En revision" | "Aprobado" | "Rechazado";

export type RepseDocument = {
  id: string;
  periodId: string;
  contractId: string;
  supplierId: string;
  documentType: string;
  section: "Alta" | "Vigencia" | "Mensual" | "Cuatrimestral";
  status: DocumentStatus;
  fileName?: string;
  validatorComment?: string;
};

export type EvaluationConfig = {
  weights: { A: number; B: number; C: number };
  criteria: Record<"A" | "B" | "C", string[]>;
};

export type EvaluationVersion = {
  id: string;
  supplierId: string;
  createdAt: string;
  scores: Record<string, number>;
  finalScore: number;
  category: "APTO" | "EN DESARROLLO" | "NO APTO";
};

export type AuditEvent = {
  id: string;
  createdAt: string;
  type: string;
  message: string;
};

export type ImprovementPlan = {
  id: string;
  supplierId: string;
  title: string;
  finding: string;
  actionRequired: string;
  responsible: string;
  dueDate: string;
  status: "Abierto" | "En seguimiento" | "Cerrado";
};

export type LibraryItem = {
  id: string;
  title: string;
  category: "Politica" | "Reglamento" | "Tutorial";
  fileName: string;
  published: boolean;
};

export type DemoConfig = {
  billingUrl: string;
  empresaNombre: string;
};
