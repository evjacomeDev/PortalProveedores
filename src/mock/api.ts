import { db } from "./db";
<<<<<<< HEAD
import type { Contract, EvaluationVersion, Role, Supplier, User } from "./types";
=======
import type { Area, Contract, DocumentCatalogItem, DocumentSection, EvaluationCategory, EvaluationPhase, EvaluationVersion, Role, Supplier, User } from "./types";
>>>>>>> cfdacd9 (Cierre de demo commit)

const delay = () => new Promise((r) => setTimeout(r, 400 + Math.random() * 500));
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

function audit(type: string, message: string) {
  db.auditEvents.unshift({ id: id("evt"), createdAt: new Date().toISOString(), type, message });
}

export async function login(params: { role?: Role; email?: string; password?: string }) {
  await delay();
  let user: User | undefined;
  if (params.role) user = db.users.find((u) => u.role === params.role);
  if (!user && params.email) user = db.users.find((u) => u.email === params.email);
  if (!user) throw new Error("Credenciales de demo invalidas");
  audit("login", `Inicio de sesion: ${user.email}`);
  return user;
}

export async function listSuppliers() {
  await delay();
  return db.suppliers;
}

export async function createSupplier(payload: Omit<Supplier, "id" | "createdAt" | "status">) {
  await delay();
  const supplier: Supplier = { ...payload, id: id("sup"), createdAt: new Date().toISOString().slice(0, 10), status: "Pre-registrado" };
  db.suppliers.unshift(supplier);
  audit("supplier", `Alta proveedor ${supplier.name}. Correo simulado enviado.`);
  return supplier;
}

export async function updateSupplierStatus(supplierId: string, status: Supplier["status"]) {
  await delay();
  const sup = db.suppliers.find((s) => s.id === supplierId);
  if (!sup) throw new Error("Proveedor no encontrado");
  sup.status = status;
  audit("supplier_status", `${sup.name} -> ${status}`);
  return sup;
}

export async function listContracts(supplierId?: string) {
  await delay();
  return supplierId ? db.contracts.filter((c) => c.supplierId === supplierId) : db.contracts;
}

export async function createContract(payload: Omit<Contract, "id" | "status">) {
  await delay();
  const duplicate = db.contracts.some(
    (c) =>
      c.supplierId === payload.supplierId &&
      c.society === payload.society &&
      c.service === payload.service &&
      c.startDate === payload.startDate &&
      c.endDate === payload.endDate,
  );
  if (duplicate) throw new Error("Contrato duplicado para proveedor/sociedad/servicio/vigencia");
  const contract: Contract = { ...payload, id: id("con"), status: "En revision" };
  db.contracts.unshift(contract);
  audit("contract", `Contrato creado ${contract.service}`);
  return contract;
}

export async function generatePeriods() {
  await delay();
  const vigentes = db.contracts.filter((c) => c.status === "Vigente");
  vigentes.forEach((contract) => {
    const label = new Date().toISOString().slice(0, 7);
    const exists = db.periods.some((p) => p.contractId === contract.id && p.label === label);
    if (!exists) {
      db.periods.unshift({
        id: id("per"),
        contractId: contract.id,
        supplierId: contract.supplierId,
        label,
        dueDate: `${label}-10`,
        status: "Abierto",
      });
    }
  });
  audit("period", "Periodos generados para contratos vigentes");
  return db.periods;
}

export async function uploadDoc(params: { periodId: string; documentId: string; fileName: string }) {
  await delay();
  const doc = db.documents.find((d) => d.id === params.documentId && d.periodId === params.periodId);
  if (!doc) throw new Error("Documento no encontrado");
  doc.fileName = params.fileName;
  doc.status = "Cargado";
  audit("doc_upload", `Documento cargado ${params.fileName}`);
  return doc;
}

export async function sendPeriodToValidation(periodId: string) {
  await delay();
  db.documents.filter((d) => d.periodId === periodId).forEach((d) => (d.status = "En revision"));
  const period = db.periods.find((p) => p.id === periodId);
  if (period) period.status = "En validacion";
  audit("period_validation", `Periodo ${periodId} enviado a validacion`);
}

export async function approveDoc(documentId: string, comment?: string) {
  await delay();
  const doc = db.documents.find((d) => d.id === documentId);
  if (!doc) throw new Error("Documento no encontrado");
  doc.status = "Aprobado";
  doc.validatorComment = comment;
  const docs = db.documents.filter((d) => d.periodId === doc.periodId);
  if (docs.every((d) => d.status === "Aprobado")) {
    const period = db.periods.find((p) => p.id === doc.periodId);
    if (period) period.status = "Aprobado";
  }
  audit("doc_approve", `Documento aprobado ${doc.documentType}`);
}

export async function rejectDoc(documentId: string, reason: string) {
  await delay();
  if (!reason.trim()) throw new Error("Motivo de rechazo obligatorio");
  const doc = db.documents.find((d) => d.id === documentId);
  if (!doc) throw new Error("Documento no encontrado");
  doc.status = "Rechazado";
  doc.validatorComment = reason;
  const period = db.periods.find((p) => p.id === doc.periodId);
  if (period) period.status = "En captura";
  audit("doc_reject", `Documento rechazado ${doc.documentType}`);
}

<<<<<<< HEAD
export async function createEvaluation(supplierId: string, scores: Record<string, number>) {
  await delay();
  const grouped = { A: 0, B: 0, C: 0 };
  Object.entries(scores).forEach(([key, value]) => {
    const dim = key.split(":")[0] as "A" | "B" | "C";
    grouped[dim] += value;
  });
  const percentages = {
    A: Math.min(100, (grouped.A / (db.evaluationConfig.criteria.A.length * 5)) * 100),
    B: Math.min(100, (grouped.B / (db.evaluationConfig.criteria.B.length * 5)) * 100),
    C: Math.min(100, (grouped.C / (db.evaluationConfig.criteria.C.length * 5)) * 100),
  };
  const finalScore =
    percentages.A * db.evaluationConfig.weights.A +
    percentages.B * db.evaluationConfig.weights.B +
    percentages.C * db.evaluationConfig.weights.C;
  const category = finalScore >= 80 ? "APTO" : finalScore >= 60 ? "EN DESARROLLO" : "NO APTO";
  const version: EvaluationVersion = {
    id: id("eval"),
    supplierId,
    createdAt: new Date().toISOString(),
    scores,
    finalScore,
    category,
  };
  db.evaluations.unshift(version);
  audit("evaluation", `Evaluacion ${supplierId}: ${finalScore.toFixed(1)} (${category})`);
  return version;
}

=======
function scoreToCategory(score: number): EvaluationCategory {
  if (score >= 85) return "EXCELENTE";
  if (score >= 70) return "CONFIABLE";
  if (score >= 60) return "REGULAR";
  if (score >= 50) return "EN DESARROLLO";
  return "RIESGO ALTO";
}

function nextReviewDateFrom(createdAt: string, score: number): string {
  const d = new Date(createdAt);
  d.setMonth(d.getMonth() + (score < 70 ? 6 : 12));
  return d.toISOString().slice(0, 10);
}

export async function createEvaluation(supplierId: string, scores: Record<string, number>) {
  await delay();
  const cfg = db.evaluationConfig;
  const grouped = { A: 0, B: 0, C: 0 } as Record<EvaluationPhase, number>;
  Object.entries(scores).forEach(([key, value]) => {
    const dim = key.split(":")[0] as EvaluationPhase;
    grouped[dim] += value;
  });
  const percentages = {
    A: Math.min(100, (grouped.A / (cfg.criteria.A.length * 5)) * 100),
    B: Math.min(100, (grouped.B / (cfg.criteria.B.length * 5)) * 100),
    C: Math.min(100, (grouped.C / (cfg.criteria.C.length * 5)) * 100),
  };
  const finalScore =
    percentages.A * cfg.weights.A +
    percentages.B * cfg.weights.B +
    percentages.C * cfg.weights.C;
  const createdAt = new Date().toISOString();
  const version: EvaluationVersion = {
    id: id("eval"),
    supplierId,
    createdAt,
    scores,
    finalScore,
    category: scoreToCategory(finalScore),
    nextReviewDate: nextReviewDateFrom(createdAt, finalScore),
  };
  db.evaluations.unshift(version);
  audit("evaluation", `Evaluacion ${supplierId}: ${finalScore.toFixed(1)} (${version.category})`);
  return version;
}

export async function createUser(
  payload: Omit<User, "id" | "lastLogin"> & { password?: string }
) {
  await delay();
  if (db.users.some((u) => u.email === payload.email)) {
    throw new Error("El correo ya está en uso");
  }
  const newUser: User = {
    ...payload,
    id: id("usr"),
    lastLogin: undefined,
  };
  db.users.push(newUser);
  audit("user_create", `Usuario creado: ${newUser.name} (${newUser.role}) — áreas: ${newUser.areas.join(", ") || "ninguna"}`);
  return newUser;
}

export async function updateUser(
  userId: string,
  updates: Partial<Pick<User, "name" | "email" | "role" | "areas" | "status">>
) {
  await delay();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("Usuario no encontrado");
  if (updates.email && updates.email !== user.email) {
    if (db.users.some((u) => u.email === updates.email)) {
      throw new Error("El correo ya está en uso");
    }
  }
  Object.assign(user, updates);
  audit("user_update", `Usuario actualizado: ${user.name}`);
  return user;
}

export async function toggleUserStatus(userId: string) {
  await delay();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("Usuario no encontrado");
  user.status = user.status === "Activo" ? "Inactivo" : "Activo";
  audit("user_status", `${user.name} → ${user.status}`);
  return user;
}

>>>>>>> cfdacd9 (Cierre de demo commit)
export async function listEvaluations(supplierId: string) {
  await delay();
  return db.evaluations.filter((e) => e.supplierId === supplierId);
}

<<<<<<< HEAD
=======
export async function listCatalogItems(section?: DocumentSection) {
  await delay();
  return section
    ? db.documentCatalog.filter((c) => c.section === section)
    : db.documentCatalog;
}

export async function saveCatalogItem(item: Omit<DocumentCatalogItem, "id"> & { id?: string }) {
  await delay();
  if (item.id) {
    const idx = db.documentCatalog.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      db.documentCatalog[idx] = item as DocumentCatalogItem;
      audit("catalog_update", `Documento catálogo actualizado: ${item.name}`);
      return db.documentCatalog[idx];
    }
  }
  const newItem: DocumentCatalogItem = { ...item, id: id("dc") };
  db.documentCatalog.push(newItem);
  audit("catalog_create", `Nuevo documento catálogo: ${newItem.name}`);
  return newItem;
}

export async function deleteCatalogItem(itemId: string) {
  await delay();
  const idx = db.documentCatalog.findIndex((c) => c.id === itemId);
  if (idx < 0) throw new Error("Item no encontrado");
  const [removed] = db.documentCatalog.splice(idx, 1);
  audit("catalog_delete", `Documento catálogo eliminado: ${removed.name}`);
}

export function exportRankingCSV() {
  const rows = db.suppliers
    .map((s) => {
      const evals = db.evaluations
        .filter((e) => e.supplierId === s.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = evals[0];
      const vencidos = db.periods.filter(
        (p) => p.supplierId === s.id && p.status === "Vencido"
      ).length;
      const docsPendientes = db.documents.filter(
        (d) => d.supplierId === s.id && d.status === "Pendiente"
      ).length;
      return {
        proveedor: s.name,
        tipo: s.type,
        estatus: s.status,
        score: latest?.finalScore?.toFixed(1) ?? "Sin eval",
        categoria: latest?.category ?? "—",
        proxima_evaluacion: latest?.nextReviewDate ?? "—",
        periodos_vencidos: vencidos,
        docs_pendientes: docsPendientes,
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map((r, i) => ({ rank: i + 1, ...r }));
  exportCSV(rows, "ranking_proveedores.csv");
}

export function exportEvaluationDetailCSV() {
  const cfg = db.evaluationConfig;
  const rows = db.evaluations.map((ev) => {
    const sup = db.suppliers.find((s) => s.id === ev.supplierId);
    const phaseScore = (dim: "A" | "B" | "C") => {
      const keys = cfg.criteria[dim].map((c) => `${dim}:${c}`);
      const sum = keys.reduce((acc, k) => acc + (ev.scores[k] ?? 0), 0);
      return ((sum / (keys.length * 5)) * 100).toFixed(1);
    };
    return {
      proveedor: sup?.name ?? ev.supplierId,
      fecha_evaluacion: ev.createdAt.slice(0, 10),
      score_total: ev.finalScore.toFixed(1),
      [`fase_${cfg.phaseLabels?.A ?? "A"}`]: phaseScore("A"),
      [`fase_${cfg.phaseLabels?.B ?? "B"}`]: phaseScore("B"),
      [`fase_${cfg.phaseLabels?.C ?? "C"}`]: phaseScore("C"),
      categoria: ev.category,
      proxima_evaluacion: ev.nextReviewDate ?? "—",
    };
  });
  exportCSV(rows, "evaluacion_por_fase_criterio.csv");
}

export function exportDocumentStatusCSV() {
  const rows = db.documents.map((d) => {
    const sup = db.suppliers.find((s) => s.id === d.supplierId);
    const daysLeft = d.expiryDate
      ? Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000)
      : null;
    return {
      proveedor: sup?.name ?? d.supplierId,
      documento: d.documentType,
      seccion: d.section,
      estado: d.status,
      archivo: d.fileName ?? "—",
      fecha_carga: d.uploadedAt ?? "—",
      fecha_vencimiento: d.expiryDate ?? "Sin vencimiento",
      dias_restantes: daysLeft !== null ? daysLeft : "N/A",
      alerta: daysLeft !== null && daysLeft < 30
        ? daysLeft < 0 ? "VENCIDO" : "PRÓXIMO A VENCER"
        : "",
    };
  });
  exportCSV(rows, "estatus_documental_vigencias.csv");
}

export function exportEvaluationHistoryCSV() {
  const rows = db.evaluations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((ev) => {
      const sup = db.suppliers.find((s) => s.id === ev.supplierId);
      return {
        proveedor: sup?.name ?? ev.supplierId,
        tipo_proveedor: sup?.type ?? "—",
        fecha_evaluacion: ev.createdAt.slice(0, 10),
        score: ev.finalScore.toFixed(1),
        categoria: ev.category,
        proxima_evaluacion: ev.nextReviewDate ?? "—",
      };
    });
  exportCSV(rows, "historial_evaluaciones.csv");
}

>>>>>>> cfdacd9 (Cierre de demo commit)
export function exportCSV(rows: Record<string, unknown>[], fileName: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")).join("\n");
  const csv = `${headers.join(",")}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  link.click();
}
