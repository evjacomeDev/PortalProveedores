import { db } from "./db";
import type { Contract, EvaluationVersion, Role, Supplier, User } from "./types";

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

export async function listEvaluations(supplierId: string) {
  await delay();
  return db.evaluations.filter((e) => e.supplierId === supplierId);
}

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
