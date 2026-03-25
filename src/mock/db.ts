import type {
  AuditEvent,
  Contract,
  DemoConfig,
<<<<<<< HEAD
=======
  DocumentCatalogItem,
>>>>>>> cfdacd9 (Cierre de demo commit)
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
<<<<<<< HEAD
=======
  documentCatalog: DocumentCatalogItem[];
>>>>>>> cfdacd9 (Cierre de demo commit)
} = {
  demoConfig: {
    empresaNombre: "EMPRESA Demo",
    billingUrl: "https://facturacion.ejemplo-empresa.demo/login",
  },
  users: [
<<<<<<< HEAD
    { id: "u1", name: "Admin Global", email: "ag@demo.com", role: "AG", status: "Activo" },
    { id: "u2", name: "Evaluador Compras", email: "compras@demo.com", role: "CO", status: "Activo" },
    { id: "u3", name: "Evaluador Calidad", email: "calidad@demo.com", role: "CA", status: "Activo" },
    { id: "u4", name: "Evaluador I+D", email: "id@demo.com", role: "ID", status: "Activo" },
    { id: "u5", name: "Evaluador Finanzas", email: "finanzas@demo.com", role: "FI", status: "Activo" },
    { id: "u6", name: "Consulta General", email: "cons@demo.com", role: "CS", status: "Activo" },
    { id: "u7", name: "Proveedor Admin", email: "pa@demo.com", role: "PA", status: "Activo", supplierId: "s1" },
=======
    { id: "u1", name: "Admin Global", email: "ag@demo.com", role: "AG", areas: ["Administración"], status: "Activo", lastLogin: "2026-03-24T08:00:00Z" },
    { id: "u2", name: "Evaluador Compras", email: "compras@demo.com", role: "CO", areas: ["Compras"], status: "Activo", lastLogin: "2026-03-23T14:30:00Z" },
    { id: "u3", name: "Evaluador Calidad", email: "calidad@demo.com", role: "CA", areas: ["Calidad"], status: "Activo", lastLogin: "2026-03-22T09:15:00Z" },
    { id: "u4", name: "Evaluador I+D", email: "id@demo.com", role: "ID", areas: ["I+D"], status: "Activo", lastLogin: "2026-03-20T16:00:00Z" },
    { id: "u5", name: "Evaluador Finanzas", email: "finanzas@demo.com", role: "FI", areas: ["Finanzas"], status: "Activo", lastLogin: "2026-03-21T11:00:00Z" },
    { id: "u6", name: "Consulta General", email: "cons@demo.com", role: "CS", areas: [], status: "Activo", lastLogin: "2026-03-18T10:00:00Z" },
    { id: "u7", name: "Proveedor Admin", email: "pa@demo.com", role: "PA", areas: [], status: "Activo", supplierId: "s1", lastLogin: "2026-03-24T07:45:00Z" },
    { id: "u8", name: "Gerente Compras-Calidad", email: "ger.co.ca@demo.com", role: "CO", areas: ["Compras", "Calidad"], status: "Activo", lastLogin: "2026-03-23T13:00:00Z" },
    { id: "u9", name: "Analista Compras-Finanzas", email: "an.co.fi@demo.com", role: "CO", areas: ["Compras", "Finanzas"], status: "Activo", lastLogin: "2026-03-22T17:00:00Z" },
>>>>>>> cfdacd9 (Cierre de demo commit)
  ],
  suppliers: [
    { id: "s1", name: "Servicios Alpha", type: "Servicios", status: "Activo", createdAt: "2026-01-10", shortReview: true, detailedReview: false },
    { id: "s2", name: "Logistica Beta", type: "Servicios", status: "En revision", createdAt: "2026-02-15", shortReview: true, detailedReview: true },
    { id: "s3", name: "Constructora Gamma", type: "ME", status: "En riesgo", createdAt: "2025-11-20", shortReview: true, detailedReview: true },
    { id: "s4", name: "Insumos Delta", type: "MP", status: "Bloqueado", createdAt: "2025-09-05", shortReview: false, detailedReview: false },
    { id: "s5", name: "Consultores Epsilon", type: "Servicios", status: "Activo", createdAt: "2026-03-01", shortReview: true, detailedReview: false },
    { id: "s6", name: "Sistemas Zeta", type: "ME", status: "Activo", createdAt: "2025-12-10", shortReview: true, detailedReview: true },
    { id: "s7", name: "Mantenimiento Eta", type: "MP", status: "En revision", createdAt: "2026-02-28", shortReview: false, detailedReview: false },
  ],
  contracts: [
    { id: "c1", supplierId: "s1", society: "Sociedad MX", service: "Limpieza Corporativa", startDate: "2026-01-01", endDate: "2026-12-31", status: "Vigente" },
    { id: "c1_new", supplierId: "s1", society: "Sociedad Corporativa EMPRESA", service: "Seguridad y Monitoreo", startDate: "2026-02-01", endDate: "2028-02-01", status: "Vigente" },
    { id: "c1_old", supplierId: "s1", society: "Sociedad Norte", service: "Mantenimiento General (2025)", startDate: "2025-01-01", endDate: "2025-12-31", status: "Vencido" },
    { id: "c2", supplierId: "s2", society: "Sociedad Norte", service: "Seguridad", startDate: "2026-02-01", endDate: "2026-11-30", status: "En revision" },
    { id: "c3", supplierId: "s3", society: "Sociedad Sur", service: "Remodelacion", startDate: "2025-11-01", endDate: "2026-05-31", status: "Vigente" },
    { id: "c4", supplierId: "s4", society: "Sociedad MX", service: "Papeleria", startDate: "2025-01-01", endDate: "2025-12-31", status: "Vencido" },
    { id: "c5", supplierId: "s5", society: "Sociedad Centro", service: "Auditoria", startDate: "2026-03-01", endDate: "2026-08-31", status: "Vigente" },
    { id: "c6", supplierId: "s6", society: "Sociedad Norte", service: "Licencias", startDate: "2026-01-01", endDate: "2026-12-31", status: "Vigente" },
  ],
  periods: [
    { id: "p1", contractId: "c1", supplierId: "s1", label: "2026-02", dueDate: "2026-03-10", status: "En captura" },
    { id: "p2", contractId: "c1", supplierId: "s1", label: "2026-03", dueDate: "2026-04-10", status: "Abierto" },
    { id: "p1_past1", contractId: "c1_old", supplierId: "s1", label: "2025-11", dueDate: "2025-12-10", status: "Aprobado" },
    { id: "p1_past2", contractId: "c1_old", supplierId: "s1", label: "2025-12", dueDate: "2026-01-10", status: "Aprobado" },
    { id: "p_c1new_1", contractId: "c1_new", supplierId: "s1", label: "2026-02", dueDate: "2026-03-10", status: "En validacion" },
    { id: "p3", contractId: "c2", supplierId: "s2", label: "2026-01", dueDate: "2026-02-10", status: "En validacion" },
    { id: "p4", contractId: "c3", supplierId: "s3", label: "2025-12", dueDate: "2026-01-10", status: "Aprobado" },
    { id: "p5", contractId: "c4", supplierId: "s4", label: "2025-11", dueDate: "2025-12-10", status: "Vencido" },
    { id: "p6", contractId: "c5", supplierId: "s5", label: "2026-03", dueDate: "2026-04-10", status: "Abierto" },
    { id: "p7", contractId: "c6", supplierId: "s6", label: "2026-02", dueDate: "2026-03-10", status: "Aprobado" },
    { id: "p8", contractId: "c6", supplierId: "s6", label: "2026-03", dueDate: "2026-04-10", status: "En captura" },
  ],
  documents: [
<<<<<<< HEAD
    { id: "d1", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "ADM-COM-F-009 Solicitud", section: "Documentos de la Empresa", status: "Cargado", fileName: "solicitud_ingreso.pdf" },
    { id: "d2", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Constancia Situación Fiscal", section: "Documentos de la Empresa", status: "Pendiente" },
    { id: "d3", periodId: "p2", contractId: "c1", supplierId: "s1", documentType: "Fichas Técnicas", section: "Documentos Técnicos", status: "Cargado", fileName: "ft_insumos.pdf" },
    { id: "d_s1_4", periodId: "p_c1new_1", contractId: "c1_new", supplierId: "s1", documentType: "Póliza de Responsabilidad Civil", section: "Documentos de la Empresa", status: "En revision", fileName: "poliza_seguridad.pdf" },
    { id: "d_s1_5", periodId: "p_c1new_1", contractId: "c1_new", supplierId: "s1", documentType: "Aviso de Privacidad", section: "Documentos de la Empresa", status: "Aprobado", fileName: "aviso_firmado.pdf" },
    { id: "d_s1_6", periodId: "p1_past1", contractId: "c1_old", supplierId: "s1", documentType: "Declaración Anual 2024", section: "Documentos Técnicos", status: "Aprobado", fileName: "declaracion_2024.pdf" },
    { id: "d_s1_7", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "REPSE Vigente", section: "Documentos Técnicos", status: "Pendiente" },
    { id: "d_s1_8", periodId: "p1_past2", contractId: "c1_old", supplierId: "s1", documentType: "Comprobante Facturación", section: "Documentos de la Empresa", status: "Aprobado", fileName: "facturas_dic.zip" },
    { id: "d4", periodId: "p3", contractId: "c2", supplierId: "s2", documentType: "Certificación ISO", section: "Documentos Técnicos", status: "Rechazado", fileName: "iso_vencida.pdf" },
    { id: "d5", periodId: "p4", contractId: "c3", supplierId: "s3", documentType: "Comprobante Domicilio", section: "Documentos de la Empresa", status: "Cargado", fileName: "cfe_recibo.pdf" },
    { id: "d6", periodId: "p5", contractId: "c4", supplierId: "s4", documentType: "Poder Notarial", section: "Documentos de la Empresa", status: "Pendiente" },
    { id: "d7", periodId: "p6", contractId: "c5", supplierId: "s5", documentType: "Acta Constitutiva", section: "Documentos de la Empresa", status: "Cargado", fileName: "acta.pdf" },
    { id: "d8", periodId: "p7", contractId: "c6", supplierId: "s6", documentType: "Licencia de Software", section: "Documentos Técnicos", status: "Cargado", fileName: "lic_ms_2026.pdf" },
=======
    { id: "d1", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "ADM-COM-F-009 Solicitud", catalogItemId: "dc08", section: "Empresa", status: "Cargado", fileName: "solicitud_ingreso.pdf", uploadedAt: "2026-01-10" },
    { id: "d2", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Constancia Situación Fiscal", catalogItemId: "dc01", section: "Empresa", status: "Pendiente" },
    { id: "d3", periodId: "p2", contractId: "c1", supplierId: "s1", documentType: "Fichas Técnicas", catalogItemId: "dc12", section: "Tecnico", status: "Cargado", fileName: "ft_insumos.pdf", uploadedAt: "2026-01-20" },
    { id: "d_s1_4", periodId: "p_c1new_1", contractId: "c1_new", supplierId: "s1", documentType: "Póliza de Responsabilidad Civil", section: "Empresa", status: "En revision", fileName: "poliza_seguridad.pdf", uploadedAt: "2026-02-01" },
    { id: "d_s1_5", periodId: "p_c1new_1", contractId: "c1_new", supplierId: "s1", documentType: "Aviso de Privacidad", section: "Empresa", status: "Aprobado", fileName: "aviso_firmado.pdf", uploadedAt: "2026-02-01" },
    { id: "d_s1_6", periodId: "p1_past1", contractId: "c1_old", supplierId: "s1", documentType: "Declaración Anual 2024", section: "Tecnico", status: "Aprobado", fileName: "declaracion_2024.pdf", uploadedAt: "2025-11-15" },
    { id: "d_s1_7", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "REPSE Vigente", section: "Vigencia", status: "Pendiente" },
    { id: "d_s1_8", periodId: "p1_past2", contractId: "c1_old", supplierId: "s1", documentType: "Comprobante Facturación", section: "Empresa", status: "Aprobado", fileName: "facturas_dic.zip", uploadedAt: "2025-12-20" },
    { id: "d4", periodId: "p3", contractId: "c2", supplierId: "s2", documentType: "Certificación ISO", catalogItemId: "dc10", section: "Tecnico", status: "Rechazado", fileName: "iso_vencida.pdf", uploadedAt: "2026-01-15", validatorComment: "Certificación vencida, favor de actualizar" },
    { id: "d5", periodId: "p4", contractId: "c3", supplierId: "s3", documentType: "Comprobante Domicilio", catalogItemId: "dc02", section: "Empresa", status: "Cargado", fileName: "cfe_recibo.pdf", uploadedAt: "2026-01-10" },
    { id: "d6", periodId: "p5", contractId: "c4", supplierId: "s4", documentType: "Poder Notarial", catalogItemId: "dc05", section: "Empresa", status: "Pendiente" },
    { id: "d7", periodId: "p6", contractId: "c5", supplierId: "s5", documentType: "Acta Constitutiva", catalogItemId: "dc04", section: "Empresa", status: "Cargado", fileName: "acta.pdf", uploadedAt: "2026-03-01" },
    { id: "d8", periodId: "p7", contractId: "c6", supplierId: "s6", documentType: "Licencia de Software", catalogItemId: "dc11", section: "Tecnico", status: "Cargado", fileName: "lic_ms_2026.pdf", uploadedAt: "2026-01-01", expiryDate: "2027-01-01" },
    // Nuevos documentos GAP2
    { id: "d_emp_s1_csf", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Constancia de Situación Fiscal (SAT)", catalogItemId: "dc01", section: "Empresa", status: "Aprobado", fileName: "csf_s1.pdf", uploadedAt: "2026-01-15", expiryDate: "2026-04-15" },
    { id: "d_emp_s1_dom", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Comprobante de domicilio fiscal", catalogItemId: "dc02", section: "Empresa", status: "Aprobado", fileName: "domicilio_s1.pdf", uploadedAt: "2026-01-15", expiryDate: "2026-04-15" },
    { id: "d_emp_s1_acta", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Acta constitutiva", catalogItemId: "dc04", section: "Empresa", status: "Aprobado", fileName: "acta_s1.pdf", uploadedAt: "2026-01-10" },
    { id: "d_emp_s1_banco", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Carta bancaria / Estado de cuenta", catalogItemId: "dc07", section: "Empresa", status: "Pendiente" },
    { id: "d_tec_s1_iso", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Certificaciones de calidad (FSSC 22000 / BPM / ISO / HACCP)", catalogItemId: "dc10", section: "Tecnico", status: "Cargado", fileName: "iso9001_s1.pdf", uploadedAt: "2026-02-01", expiryDate: "2027-02-01" },
    { id: "d_tec_s1_ficha", periodId: "p1", contractId: "c1", supplierId: "s1", documentType: "Fichas técnicas de productos / servicios", catalogItemId: "dc12", section: "Tecnico", status: "Aprobado", fileName: "fichas_s1.pdf", uploadedAt: "2026-01-20" },
    { id: "d_emp_s2_csf", periodId: "p3", contractId: "c2", supplierId: "s2", documentType: "Constancia de Situación Fiscal (SAT)", catalogItemId: "dc01", section: "Empresa", status: "En revision", fileName: "csf_s2.pdf", uploadedAt: "2026-02-01", expiryDate: "2026-05-01" },
    { id: "d_tec_s2_lic", periodId: "p3", contractId: "c2", supplierId: "s2", documentType: "Licencias aplicables", catalogItemId: "dc11", section: "Tecnico", status: "Rechazado", fileName: "licencias_s2.pdf", validatorComment: "Licencia vencida, favor de actualizar", uploadedAt: "2026-01-15", expiryDate: "2026-01-15" },
    { id: "d_emp_s3_poder", periodId: "p4", contractId: "c3", supplierId: "s3", documentType: "Poder notarial del representante legal", catalogItemId: "dc05", section: "Empresa", status: "Pendiente" },
    { id: "d_tec_s5_cert", periodId: "p6", contractId: "c5", supplierId: "s5", documentType: "Certificaciones de calidad (FSSC 22000 / BPM / ISO / HACCP)", catalogItemId: "dc10", section: "Tecnico", status: "Aprobado", fileName: "haccp_s5.pdf", uploadedAt: "2025-12-01", expiryDate: "2026-12-01" },
>>>>>>> cfdacd9 (Cierre de demo commit)
  ],
  evaluations: [
    {
      id: "ev_seed_s1",
      supplierId: "s1",
      createdAt: "2026-02-15T10:00:00.000Z",
<<<<<<< HEAD
      scores: { "A:Cumplimiento documental": 4, "A:Tiempo de respuesta": 4, "B:Calidad de servicio": 3, "B:Incidencias": 4, "C:Riesgo laboral": 4, "C:Apego a procesos": 3 },
      finalScore: 82.5,
      category: "CONFIABLE",
=======
      scores: {
        "A:Cumplimiento documental": 4, "A:Tiempo de respuesta": 4, "A:Solvencia económica": 3,
        "B:Calidad de servicio": 3, "B:Incidencias reportadas": 4, "B:Cumplimiento de plazos": 4,
        "C:Riesgo laboral": 4, "C:Apego a procesos": 3, "C:Capacidad de innovación": 3,
      },
      finalScore: 71.7,
      category: "CONFIABLE",
      nextReviewDate: "2027-02-15",
>>>>>>> cfdacd9 (Cierre de demo commit)
    },
    {
      id: "ev_old_s1",
      supplierId: "s1",
      createdAt: "2025-02-15T10:00:00.000Z",
<<<<<<< HEAD
      scores: { "A:Cumplimiento documental": 3, "A:Tiempo de respuesta": 3, "B:Calidad de servicio": 3, "B:Incidencias": 2, "C:Riesgo laboral": 3, "C:Apego a procesos": 2 },
      finalScore: 68.0,
      category: "RIESGO ALTO",
=======
      scores: {
        "A:Cumplimiento documental": 3, "A:Tiempo de respuesta": 3, "A:Solvencia económica": 3,
        "B:Calidad de servicio": 3, "B:Incidencias reportadas": 2, "B:Cumplimiento de plazos": 3,
        "C:Riesgo laboral": 3, "C:Apego a procesos": 2, "C:Capacidad de innovación": 3,
      },
      finalScore: 56.0,
      category: "EN DESARROLLO",
      nextReviewDate: "2025-08-15",
>>>>>>> cfdacd9 (Cierre de demo commit)
    },
    {
      id: "ev_seed_s2",
      supplierId: "s2",
      createdAt: "2026-02-28T10:00:00.000Z",
<<<<<<< HEAD
      scores: { "A:Cumplimiento documental": 4, "A:Tiempo de respuesta": 3, "B:Calidad de servicio": 3, "B:Incidencias": 3, "C:Riesgo laboral": 3, "C:Apego a procesos": 3 },
      finalScore: 75.0,
      category: "REGULAR",
=======
      scores: {
        "A:Cumplimiento documental": 4, "A:Tiempo de respuesta": 3, "A:Solvencia económica": 3,
        "B:Calidad de servicio": 3, "B:Incidencias reportadas": 3, "B:Cumplimiento de plazos": 3,
        "C:Riesgo laboral": 3, "C:Apego a procesos": 3, "C:Capacidad de innovación": 3,
      },
      finalScore: 62.7,
      category: "REGULAR",
      nextReviewDate: "2026-08-28",
>>>>>>> cfdacd9 (Cierre de demo commit)
    },
    {
      id: "ev_seed_s3",
      supplierId: "s3",
      createdAt: "2026-03-10T10:00:00.000Z",
<<<<<<< HEAD
      scores: { "A:Cumplimiento documental": 2, "A:Tiempo de respuesta": 2, "B:Calidad de servicio": 3, "B:Incidencias": 2, "C:Riesgo laboral": 3, "C:Apego a procesos": 2 },
      finalScore: 48.0,
      category: "RIESGO ALTO",
=======
      scores: {
        "A:Cumplimiento documental": 2, "A:Tiempo de respuesta": 2, "A:Solvencia económica": 2,
        "B:Calidad de servicio": 3, "B:Incidencias reportadas": 2, "B:Cumplimiento de plazos": 2,
        "C:Riesgo laboral": 3, "C:Apego a procesos": 2, "C:Capacidad de innovación": 2,
      },
      finalScore: 44.0,
      category: "RIESGO ALTO",
      nextReviewDate: "2026-09-10",
>>>>>>> cfdacd9 (Cierre de demo commit)
    },
    {
      id: "ev_seed_s5",
      supplierId: "s5",
      createdAt: "2026-03-15T10:00:00.000Z",
<<<<<<< HEAD
      scores: { "A:Cumplimiento documental": 5, "A:Tiempo de respuesta": 5, "B:Calidad de servicio": 4, "B:Incidencias": 5, "C:Riesgo laboral": 5, "C:Apego a procesos": 4 },
      finalScore: 92.0,
      category: "EXCELENTE",
    },
  ],
  evaluationConfig: {
    weights: { A: 0.4, B: 0.3, C: 0.3 },
    criteria: {
      A: ["Cumplimiento documental", "Tiempo de respuesta"],
      B: ["Calidad de servicio", "Incidencias"],
      C: ["Riesgo laboral", "Apego a procesos"],
=======
      scores: {
        "A:Cumplimiento documental": 5, "A:Tiempo de respuesta": 5, "A:Solvencia económica": 4,
        "B:Calidad de servicio": 4, "B:Incidencias reportadas": 5, "B:Cumplimiento de plazos": 5,
        "C:Riesgo laboral": 5, "C:Apego a procesos": 4, "C:Capacidad de innovación": 4,
      },
      finalScore: 91.7,
      category: "EXCELENTE",
      nextReviewDate: "2027-03-15",
    },
  ],
  evaluationConfig: {
    weights: { A: 0.40, B: 0.35, C: 0.25 },
    phaseLabels: {
      A: "Potencial",
      B: "Funcionamiento actual",
      C: "Capacidad estratégica",
    },
    criteria: {
      A: ["Cumplimiento documental", "Tiempo de respuesta", "Solvencia económica"],
      B: ["Calidad de servicio", "Incidencias reportadas", "Cumplimiento de plazos"],
      C: ["Riesgo laboral", "Apego a procesos", "Capacidad de innovación"],
>>>>>>> cfdacd9 (Cierre de demo commit)
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
    {
      id: "pm2",
      supplierId: "s1",
      title: "Mejora en tiempos de entrega (Incidencias)",
      finding: "Demoras reportadas en centro de distribución Norte durante Q4",
      actionRequired: "Ajuste ágil en rutas logísticas y contratación de personal eventual",
      responsible: "Director Operaciones (Servicios Alpha)",
      dueDate: "2025-10-15",
      status: "Cerrado",
    },
    {
      id: "pm3",
      supplierId: "s1",
      title: "Actualización de REPSE Fase 2",
      finding: "Falta integración del anexo A",
      actionRequired: "Subir documentación en formato unificado XML/PDF",
      responsible: "Contacto proveedor",
      dueDate: "2026-05-10",
      status: "Abierto",
    },
  ],
  libraryItems: [
    { id: "lib1", title: "Código de conducta con proveedores", category: "Politica", fileName: "codigo-proveedores.pdf", published: true },
    { id: "lib2", title: "Guía de carga documental", category: "Tutorial", fileName: "guia-carga.pdf", published: true },
    { id: "lib3", title: "Lineamientos de evaluación", category: "Reglamento", fileName: "evaluacion-proveedores.pdf", published: true },
  ],
  auditEvents: [{ id: "a1", createdAt: new Date().toISOString(), type: "seed", message: "Demo iniciada" }],
<<<<<<< HEAD
=======
  documentCatalog: [
    // ── Documentos de la Empresa ──────────────────────────────
    { id: "dc01", name: "Constancia de Situación Fiscal (SAT)", section: "Empresa", mandatory: true, validityDays: 90, allowedFormats: ["PDF"], visibleToProvider: true, description: "Máximo 3 meses de antigüedad" },
    { id: "dc02", name: "Comprobante de domicilio fiscal", section: "Empresa", mandatory: true, validityDays: 90, allowedFormats: ["PDF"], visibleToProvider: true },
    { id: "dc03", name: "Opinión de cumplimiento SAT (positiva)", section: "Empresa", mandatory: true, validityDays: 90, allowedFormats: ["PDF"], visibleToProvider: true },
    { id: "dc04", name: "Acta constitutiva", section: "Empresa", mandatory: true, validityDays: 0, allowedFormats: ["PDF"], visibleToProvider: true },
    { id: "dc05", name: "Poder notarial del representante legal", section: "Empresa", mandatory: true, validityDays: 0, allowedFormats: ["PDF"], visibleToProvider: true },
    { id: "dc06", name: "Identificación oficial del representante legal", section: "Empresa", mandatory: true, validityDays: 365, allowedFormats: ["PDF"], visibleToProvider: true },
    { id: "dc07", name: "Carta bancaria / Estado de cuenta", section: "Empresa", mandatory: true, validityDays: 90, allowedFormats: ["PDF"], visibleToProvider: true, description: "Para validar CLABE interbancaria" },
    { id: "dc08", name: "Información general del proveedor (ADM-COM-F-009)", section: "Empresa", mandatory: true, validityDays: 0, allowedFormats: ["PDF", "DOCX"], visibleToProvider: true },
    { id: "dc09", name: "Contactos del proveedor", section: "Empresa", mandatory: false, validityDays: 0, allowedFormats: ["PDF", "DOCX", "XLSX"], visibleToProvider: true },
    // ── Documentos Técnicos (Calidad / I+D) ───────────────────
    { id: "dc10", name: "Certificaciones de calidad (FSSC 22000 / BPM / ISO / HACCP)", section: "Tecnico", mandatory: false, validityDays: 365, allowedFormats: ["PDF"], visibleToProvider: true, description: "Aplica según tipo de proveedor" },
    { id: "dc11", name: "Licencias aplicables", section: "Tecnico", mandatory: false, validityDays: 365, allowedFormats: ["PDF"], visibleToProvider: true },
    { id: "dc12", name: "Fichas técnicas de productos / servicios", section: "Tecnico", mandatory: false, validityDays: 0, allowedFormats: ["PDF", "DOCX", "XLSX"], visibleToProvider: true },
    { id: "dc13", name: "Requisitos del sistema de gestión de calidad", section: "Tecnico", mandatory: false, validityDays: 0, allowedFormats: ["PDF", "DOCX"], visibleToProvider: false, description: "Solo visible internamente" },
  ],
>>>>>>> cfdacd9 (Cierre de demo commit)
};
