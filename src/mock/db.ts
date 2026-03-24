import type {
  AuditEvent,
  Contract,
  DemoConfig,
  EvaluationConfig,
  EvaluationVersion,
  ImprovementPlan,
  LibraryItem,
  Period,
  RepseDocument,
  Supplier,
  User,
} from "./types";

export const db: {
  demoConfig: DemoConfig;
  users: User[];
  suppliers: Supplier[];
  contracts: Contract[];
  periods: Period[];
  documents: RepseDocument[];
  evaluations: EvaluationVersion[];
  evaluationConfig: EvaluationConfig;
  improvementPlans: ImprovementPlan[];
  libraryItems: LibraryItem[];
  auditEvents: AuditEvent[];
} = {
  demoConfig: {
    empresaNombre: "EMPRESA Demo",
    billingUrl: "https://facturacion.ejemplo-empresa.demo/login",
  },
  users: [
    { id: "u1", name: "Admin Portal", email: "ap@demo.com", role: "AP", status: "Activo" },
    { id: "u2", name: "Admin Catalogos", email: "ac@demo.com", role: "AC", status: "Activo" },
    { id: "u3", name: "Compras", email: "co@demo.com", role: "CO", status: "Activo" },
    { id: "u4", name: "Validador", email: "vr@demo.com", role: "VR", status: "Activo" },
    { id: "u5", name: "TI", email: "ti@demo.com", role: "TI", status: "Activo" },
    { id: "u6", name: "Proveedor Admin", email: "pa@demo.com", role: "PA", status: "Activo", supplierId: "s1" },
    { id: "u7", name: "Proveedor User", email: "pu@demo.com", role: "PU", status: "Activo", supplierId: "s1" },
  ],
  suppliers: [
    { id: "s1", name: "Servicios Alpha", type: "Outsourcing", status: "Activo", createdAt: "2026-01-10", shortReview: true, detailedReview: false },
    { id: "s2", name: "Logistica Beta", type: "Transporte", status: "En revision", createdAt: "2026-02-15", shortReview: true, detailedReview: true },
    { id: "s3", name: "Constructora Gamma", type: "Obra", status: "En riesgo", createdAt: "2025-11-20", shortReview: true, detailedReview: true },
    { id: "s4", name: "Insumos Delta", type: "Materiales", status: "Bloqueado", createdAt: "2025-09-05", shortReview: false, detailedReview: false },
    { id: "s5", name: "Consultores Epsilon", type: "Legal", status: "Activo", createdAt: "2026-03-01", shortReview: true, detailedReview: false },
    { id: "s6", name: "Sistemas Zeta", type: "Tecnologia", status: "Activo", createdAt: "2025-12-10", shortReview: true, detailedReview: true },
    { id: "s7", name: "Mantenimiento Eta", type: "Instalaciones", status: "En revision", createdAt: "2026-02-28", shortReview: false, detailedReview: false },
  ],
  contracts: [
    { id: "c1", supplierId: "s1", society: "Sociedad MX", service: "Limpieza", startDate: "2026-01-01", endDate: "2026-12-31", status: "Vigente" },
    { id: "c2", supplierId: "s2", society: "Sociedad Norte", service: "Seguridad", startDate: "2026-02-01", endDate: "2026-11-30", status: "En revision" },
    { id: "c3", supplierId: "s3", society: "Sociedad Sur", service: "Remodelacion", startDate: "2025-11-01", endDate: "2026-05-31", status: "Vigente" },
    { id: "c4", supplierId: "s4", society: "Sociedad MX", service: "Papeleria", startDate: "2025-01-01", endDate: "2025-12-31", status: "Vencido" },
    { id: "c5", supplierId: "s5", society: "Sociedad Centro", service: "Auditoria", startDate: "2026-03-01", endDate: "2026-08-31", status: "Vigente" },
    { id: "c6", supplierId: "s6", society: "Sociedad Norte", service: "Licencias", startDate: "2026-01-01", endDate: "2026-12-31", status: "Vigente" },
  ],
  periods: [
    { id: "p1", contractId: "c1", supplierId: "s1", label: "2026-02", dueDate: "2026-03-10", status: "En captura" },
    { id: "p2", contractId: "c1", supplierId: "s1", label: "2026-03", dueDate: "2026-04-10", status: "Abierto" },
    { id: "p3", contractId: "c2", supplierId: "s2", label: "2026-01", dueDate: "2026-02-10", status: "En validacion" },
    { id: "p4", contractId: "c3", supplierId: "s3", label: "2025-12", dueDate: "2026-01-10", status: "Aprobado" },
    { id: "p5", contractId: "c4", supplierId: "s4", label: "2025-11", dueDate: "2025-12-10", status: "Vencido" },
    { id: "p6", contractId: "c5", supplierId: "s5", label: "2026-03", dueDate: "2026-04-10", status: "Abierto" },
    { id: "p7", contractId: "c6", supplierId: "s6", label: "2026-02", dueDate: "2026-03-10", status: "Aprobado" },
    { id: "p8", contractId: "c6", supplierId: "s6", label: "2026-03", dueDate: "2026-04-10", status: "En captura" },
  ],
  documents: [
    { id: "d1", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Constancia REPSE", section: "Vigencia", status: "Cargado", fileName: "constancia.pdf" },
    { id: "d2", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "XML Nomina", section: "Mensual", status: "Pendiente" },
  ],
  evaluations: [
    {
      id: "ev_seed_s1",
      supplierId: "s1",
      createdAt: "2026-01-15T10:00:00.000Z",
      scores: {
        "A:Cumplimiento documental": 4,
        "A:Tiempo de respuesta": 4,
        "B:Calidad de servicio": 3,
        "B:Incidencias": 4,
        "C:Riesgo laboral": 4,
        "C:Apego a procesos": 3,
      },
      finalScore: 78.5,
      category: "EN DESARROLLO",
    },
  ],
  evaluationConfig: {
    weights: { A: 0.4, B: 0.3, C: 0.3 },
    criteria: {
      A: ["Cumplimiento documental", "Tiempo de respuesta"],
      B: ["Calidad de servicio", "Incidencias"],
      C: ["Riesgo laboral", "Apego a procesos"],
    },
  },
  improvementPlans: [
    {
      id: "pm1",
      supplierId: "s1",
      title: "Regularizar constancias",
      finding: "Documentación de vigencia con observaciones menores",
      actionRequired: "Actualizar constancia y cargar evidencia",
      responsible: "Contacto proveedor",
      dueDate: "2026-04-30",
      status: "En seguimiento",
    },
  ],
  libraryItems: [
    { id: "lib1", title: "Código de conducta con proveedores", category: "Politica", fileName: "codigo-proveedores.pdf", published: true },
    { id: "lib2", title: "Guía de carga documental", category: "Tutorial", fileName: "guia-carga.pdf", published: true },
    { id: "lib3", title: "Lineamientos de evaluación", category: "Reglamento", fileName: "evaluacion-proveedores.pdf", published: true },
  ],
  auditEvents: [{ id: "a1", createdAt: new Date().toISOString(), type: "seed", message: "Demo iniciada" }],
};
