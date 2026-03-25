# GAP 2 — Documentos Técnicos (Calidad/I+D) y Catálogo Documental Editable
## Portal de Proveedores EMPRESA · Sprint demo
**Stack:** React 19 · Vite · TypeScript · React Router v7 · Zustand · Sonner · Tailwind CSS 4

---

## CONTEXTO

Repo `evjacomeDev/PortalProveedores`. Demo navegable con datos mock.
Convenciones:
- Estilos: clases `wf-*` de `src/styles/wireframe.css`
- Mock: `src/mock/db.ts` + `src/mock/api.ts` (con `await delay()` y `audit()`)
- Tipos en `src/mock/types.ts`
- `toast.success/error()` de `sonner` para feedback

---

## ESTADO ACTUAL

### `src/mock/types.ts`
```typescript
export type RepseDocument = {
  id: string;
  periodId: string;
  contractId: string;
  supplierId: string;
  documentType: string;
  section: "Alta" | "Vigencia" | "Mensual" | "Cuatrimestral"
          | "Documentos de la Empresa" | "Documentos Técnicos";
  status: DocumentStatus;
  fileName?: string;
  validatorComment?: string;
  // ← NO tiene expiryDate, allowedFormats, ni vínculo con catálogo
};
// NO existe DocumentCatalogItem
```

### `src/mock/db.ts`
No existe `documentCatalog`. Los documentos en `db.documents` usan secciones mezcladas. `CatalogsPage` muestra 2 filas hardcodeadas, no conectadas a `db`.

### `src/features/catalogs/CatalogsPage.tsx`
Shell vacío — 3 botones decorativos y tabla de 2 filas estáticas.

### `src/features/provider/ProviderDocsPage.tsx`
Muestra documentos por sección pero no diferencia "Empresa" vs "Técnico" ni tiene indicadores de vencimiento.

---

## CAMBIOS REQUERIDOS

### PASO 1 — `src/mock/types.ts`

Agrega nuevos tipos:

```typescript
export type DocumentSection =
  | "Alta"
  | "Vigencia"
  | "Mensual"
  | "Cuatrimestral"
  | "Empresa"       // ← renombrado de "Documentos de la Empresa"
  | "Tecnico";      // ← renombrado de "Documentos Técnicos"

export type DocumentCatalogItem = {
  id: string;
  name: string;
  section: DocumentSection;
  mandatory: boolean;
  validityDays: number;        // 0 = sin vencimiento, 90 = 3 meses, 365 = 1 año
  allowedFormats: string[];    // ej: ["PDF", "DOCX", "XLSX"]
  visibleToProvider: boolean;
  description?: string;
};

// Actualiza RepseDocument:
export type RepseDocument = {
  id: string;
  periodId: string;
  contractId: string;
  supplierId: string;
  documentType: string;
  catalogItemId?: string;      // NUEVO — vínculo al catálogo
  section: DocumentSection;
  status: DocumentStatus;
  fileName?: string;
  validatorComment?: string;
  uploadedAt?: string;         // NUEVO — fecha de carga
  expiryDate?: string;         // NUEVO — calculado: uploadedAt + validityDays
};
```

> ⚠️ Actualiza el tipo `section` en los documentos existentes de `db.documents`:
> `"Documentos de la Empresa"` → `"Empresa"`, `"Documentos Técnicos"` → `"Tecnico"`

### PASO 2 — `src/mock/db.ts`

Agrega `documentCatalog: DocumentCatalogItem[]` con estos 13 items:

```typescript
documentCatalog: [
  // ── Documentos de la Empresa ──────────────────────────────
  {
    id: "dc01", name: "Constancia de Situación Fiscal (SAT)",
    section: "Empresa", mandatory: true, validityDays: 90,
    allowedFormats: ["PDF"], visibleToProvider: true,
    description: "Máximo 3 meses de antigüedad",
  },
  {
    id: "dc02", name: "Comprobante de domicilio fiscal",
    section: "Empresa", mandatory: true, validityDays: 90,
    allowedFormats: ["PDF"], visibleToProvider: true,
  },
  {
    id: "dc03", name: "Opinión de cumplimiento SAT (positiva)",
    section: "Empresa", mandatory: true, validityDays: 90,
    allowedFormats: ["PDF"], visibleToProvider: true,
  },
  {
    id: "dc04", name: "Acta constitutiva",
    section: "Empresa", mandatory: true, validityDays: 0,
    allowedFormats: ["PDF"], visibleToProvider: true,
  },
  {
    id: "dc05", name: "Poder notarial del representante legal",
    section: "Empresa", mandatory: true, validityDays: 0,
    allowedFormats: ["PDF"], visibleToProvider: true,
  },
  {
    id: "dc06", name: "Identificación oficial del representante legal",
    section: "Empresa", mandatory: true, validityDays: 365,
    allowedFormats: ["PDF"], visibleToProvider: true,
  },
  {
    id: "dc07", name: "Carta bancaria / Estado de cuenta",
    section: "Empresa", mandatory: true, validityDays: 90,
    allowedFormats: ["PDF"], visibleToProvider: true,
    description: "Para validar CLABE interbancaria",
  },
  {
    id: "dc08", name: "Información general del proveedor (ADM-COM-F-009)",
    section: "Empresa", mandatory: true, validityDays: 0,
    allowedFormats: ["PDF", "DOCX"], visibleToProvider: true,
  },
  {
    id: "dc09", name: "Contactos del proveedor",
    section: "Empresa", mandatory: false, validityDays: 0,
    allowedFormats: ["PDF", "DOCX", "XLSX"], visibleToProvider: true,
  },
  // ── Documentos Técnicos (Calidad / I+D) ───────────────────
  {
    id: "dc10", name: "Certificaciones de calidad (FSSC 22000 / BPM / ISO / HACCP)",
    section: "Tecnico", mandatory: false, validityDays: 365,
    allowedFormats: ["PDF"], visibleToProvider: true,
    description: "Aplica según tipo de proveedor",
  },
  {
    id: "dc11", name: "Licencias aplicables",
    section: "Tecnico", mandatory: false, validityDays: 365,
    allowedFormats: ["PDF"], visibleToProvider: true,
  },
  {
    id: "dc12", name: "Fichas técnicas de productos / servicios",
    section: "Tecnico", mandatory: false, validityDays: 0,
    allowedFormats: ["PDF", "DOCX", "XLSX"], visibleToProvider: true,
  },
  {
    id: "dc13", name: "Requisitos del sistema de gestión de calidad",
    section: "Tecnico", mandatory: false, validityDays: 0,
    allowedFormats: ["PDF", "DOCX"], visibleToProvider: false,
    description: "Solo visible internamente",
  },
],
```

Agrega 10 documentos a `db.documents` para los proveedores existentes, usando las nuevas secciones y `catalogItemId`:

```typescript
// Agrega al array documents existente:
{ id: "d_emp_s1_csf", periodId: "p1", contractId: "c1", supplierId: "s1",
  documentType: "Constancia de Situación Fiscal (SAT)", catalogItemId: "dc01",
  section: "Empresa", status: "Aprobado", fileName: "csf_s1.pdf",
  uploadedAt: "2026-01-15", expiryDate: "2026-04-15" },

{ id: "d_emp_s1_dom", periodId: "p1", contractId: "c1", supplierId: "s1",
  documentType: "Comprobante de domicilio fiscal", catalogItemId: "dc02",
  section: "Empresa", status: "Aprobado", fileName: "domicilio_s1.pdf",
  uploadedAt: "2026-01-15", expiryDate: "2026-04-15" },

{ id: "d_emp_s1_acta", periodId: "p1", contractId: "c1", supplierId: "s1",
  documentType: "Acta constitutiva", catalogItemId: "dc04",
  section: "Empresa", status: "Aprobado", fileName: "acta_s1.pdf",
  uploadedAt: "2026-01-10" },

{ id: "d_emp_s1_banco", periodId: "p1", contractId: "c1", supplierId: "s1",
  documentType: "Carta bancaria / Estado de cuenta", catalogItemId: "dc07",
  section: "Empresa", status: "Pendiente" },

{ id: "d_tec_s1_iso", periodId: "p1", contractId: "c1", supplierId: "s1",
  documentType: "Certificaciones de calidad (FSSC 22000 / BPM / ISO / HACCP)", catalogItemId: "dc10",
  section: "Tecnico", status: "Cargado", fileName: "iso9001_s1.pdf",
  uploadedAt: "2026-02-01", expiryDate: "2027-02-01" },

{ id: "d_tec_s1_ficha", periodId: "p1", contractId: "c1", supplierId: "s1",
  documentType: "Fichas técnicas de productos / servicios", catalogItemId: "dc12",
  section: "Tecnico", status: "Aprobado", fileName: "fichas_s1.pdf",
  uploadedAt: "2026-01-20" },

{ id: "d_emp_s2_csf", periodId: "p3", contractId: "c2", supplierId: "s2",
  documentType: "Constancia de Situación Fiscal (SAT)", catalogItemId: "dc01",
  section: "Empresa", status: "En revision", fileName: "csf_s2.pdf",
  uploadedAt: "2026-02-01", expiryDate: "2026-05-01" },

{ id: "d_tec_s2_lic", periodId: "p3", contractId: "c2", supplierId: "s2",
  documentType: "Licencias aplicables", catalogItemId: "dc11",
  section: "Tecnico", status: "Rechazado", fileName: "licencias_s2.pdf",
  validatorComment: "Licencia vencida, favor de actualizar",
  uploadedAt: "2026-01-15", expiryDate: "2026-01-15" },

{ id: "d_emp_s3_poder", periodId: "p4", contractId: "c3", supplierId: "s3",
  documentType: "Poder notarial del representante legal", catalogItemId: "dc05",
  section: "Empresa", status: "Pendiente" },

{ id: "d_tec_s5_cert", periodId: "p6", contractId: "c5", supplierId: "s5",
  documentType: "Certificaciones de calidad (FSSC 22000 / BPM / ISO / HACCP)", catalogItemId: "dc10",
  section: "Tecnico", status: "Aprobado", fileName: "haccp_s5.pdf",
  uploadedAt: "2025-12-01", expiryDate: "2026-12-01" },
```

### PASO 3 — `src/mock/api.ts`

Agrega funciones para el catálogo:

```typescript
import type { DocumentCatalogItem } from "./types";

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

export function exportDocumentStatusCSV() {
  const rows = db.documents
    .filter((d) => d.section === "Empresa" || d.section === "Tecnico")
    .map((d) => {
      const sup = db.suppliers.find((s) => s.id === d.supplierId);
      const daysLeft = d.expiryDate
        ? Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000)
        : null;
      return {
        proveedor: sup?.name ?? d.supplierId,
        documento: d.documentType,
        seccion: d.section,
        estado: d.status,
        fecha_carga: d.uploadedAt ?? "—",
        vencimiento: d.expiryDate ?? "Sin vencimiento",
        dias_restantes: daysLeft !== null ? daysLeft : "N/A",
        alerta: daysLeft !== null && daysLeft < 30 ? "⚠️ Próximo" : "",
      };
    });
  exportCSV(rows, "estatus_documental.csv");
}
```

### PASO 4 — `src/features/catalogs/CatalogsPage.tsx`

Reescribe completamente:

```tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { db } from "../../mock/db";
import { saveCatalogItem, deleteCatalogItem, exportDocumentStatusCSV } from "../../mock/api";
import type { DocumentCatalogItem, DocumentSection } from "../../mock/types";

const SECTIONS: { value: DocumentSection | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "Empresa", label: "Documentos Empresa" },
  { value: "Tecnico", label: "Documentos Técnicos" },
  { value: "Vigencia", label: "REPSE — Vigencia" },
  { value: "Mensual", label: "REPSE — Mensual" },
];

const FORMATS = ["PDF", "DOCX", "XLSX", "XML"];

const EMPTY_ITEM: Omit<DocumentCatalogItem, "id"> = {
  name: "", section: "Empresa", mandatory: false,
  validityDays: 0, allowedFormats: ["PDF"], visibleToProvider: true,
};

export function CatalogsPage() {
  const [tab, setTab] = useState<DocumentSection | "all">("all");
  const [items, setItems] = useState([...db.documentCatalog]);
  const [modal, setModal] = useState<{ open: boolean; item: Partial<DocumentCatalogItem> & Omit<DocumentCatalogItem, "id"> }>({
    open: false, item: { ...EMPTY_ITEM },
  });
  const [saving, setSaving] = useState(false);

  const filtered = tab === "all" ? items : items.filter((i) => i.section === tab);

  function openNew() { setModal({ open: true, item: { ...EMPTY_ITEM } }); }
  function openEdit(item: DocumentCatalogItem) { setModal({ open: true, item: { ...item } }); }
  function closeModal() { setModal({ open: false, item: { ...EMPTY_ITEM } }); }

  async function handleSave() {
    if (!modal.item.name.trim()) { toast.error("El nombre es requerido"); return; }
    setSaving(true);
    try {
      const saved = await saveCatalogItem(modal.item);
      setItems([...db.documentCatalog]);
      toast.success(`Documento "${saved.name}" guardado`);
      closeModal();
    } finally { setSaving(false); }
  }

  async function handleDelete(item: DocumentCatalogItem) {
    await deleteCatalogItem(item.id);
    setItems([...db.documentCatalog]);
    toast.success(`"${item.name}" eliminado`);
  }

  function toggleFormat(fmt: string) {
    const fmts = modal.item.allowedFormats ?? [];
    const next = fmts.includes(fmt) ? fmts.filter((f) => f !== fmt) : [...fmts, fmt];
    setModal((m) => ({ ...m, item: { ...m.item, allowedFormats: next } }));
  }

  return (
    <>
      <h1 className="wf-page-title">Configuración documental</h1>

      {/* Tabs */}
      <div className="wf-filters mb-4">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button key={s.value} type="button"
              className={`wf-btn ${tab === s.value ? "wf-btn-primary" : "wf-btn-secondary"} text-xs`}
              onClick={() => setTab(s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wf-actions-bar mb-4">
        <button type="button" className="wf-btn wf-btn-primary" onClick={openNew}>
          + Nuevo documento
        </button>
        <button type="button" className="wf-btn wf-btn-outline text-sm" onClick={exportDocumentStatusCSV}>
          Exportar estatus (CSV)
        </button>
      </div>

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Sección</th>
                <th>Obligatorio</th>
                <th>Vigencia (días)</th>
                <th>Formatos</th>
                <th>Visible proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.name}</td>
                  <td><span className="wf-chip wf-chip-preregistered text-xs">{item.section}</span></td>
                  <td>{item.mandatory ? "✓ Sí" : "No"}</td>
                  <td>{item.validityDays === 0 ? "Sin vencimiento" : `${item.validityDays} días`}</td>
                  <td className="text-xs">{item.allowedFormats.join(", ")}</td>
                  <td>{item.visibleToProvider ? "Sí" : "No"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button type="button" className="wf-action-btn" onClick={() => openEdit(item)}>Editar</button>
                      <button type="button" className="wf-action-btn" onClick={() => handleDelete(item)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm py-4" style={{ color: "var(--wf-text-muted)" }}>
                  Sin documentos en esta sección
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="wf-card w-full max-w-lg mx-4 space-y-3">
            <h2 className="text-base font-bold">{modal.item.id ? "Editar documento" : "Nuevo documento"}</h2>

            <div>
              <label className="wf-label">Nombre del documento *</label>
              <input className="wf-input w-full" value={modal.item.name}
                onChange={(e) => setModal((m) => ({ ...m, item: { ...m.item, name: e.target.value } }))} />
            </div>

            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="wf-label">Sección</label>
                <select className="wf-input" value={modal.item.section}
                  onChange={(e) => setModal((m) => ({ ...m, item: { ...m.item, section: e.target.value as DocumentSection } }))}>
                  {SECTIONS.filter((s) => s.value !== "all").map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="wf-label">Vigencia (días, 0 = sin límite)</label>
                <input type="number" min={0} className="wf-input w-32"
                  value={modal.item.validityDays}
                  onChange={(e) => setModal((m) => ({ ...m, item: { ...m.item, validityDays: +e.target.value } }))} />
              </div>
            </div>

            <div>
              <label className="wf-label">Formatos permitidos</label>
              <div className="flex gap-3 flex-wrap mt-1">
                {FORMATS.map((fmt) => (
                  <label key={fmt} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" checked={(modal.item.allowedFormats ?? []).includes(fmt)}
                      onChange={() => toggleFormat(fmt)} />
                    {fmt}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={modal.item.mandatory}
                  onChange={(e) => setModal((m) => ({ ...m, item: { ...m.item, mandatory: e.target.checked } }))} />
                Obligatorio
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={modal.item.visibleToProvider}
                  onChange={(e) => setModal((m) => ({ ...m, item: { ...m.item, visibleToProvider: e.target.checked } }))} />
                Visible al proveedor
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="wf-btn wf-btn-secondary" onClick={closeModal}>Cancelar</button>
              <button type="button" className="wf-btn wf-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando…" : "Guardar documento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### PASO 5 — `src/features/provider/ProviderDocsPage.tsx`

Reescribe con tabs por categoría y alertas de vencimiento:

```tsx
// Estructura:
// Tabs: "De la Empresa" | "Técnicos" | "REPSE"
//
// Para cada tab:
//   1. Filtrar db.documentCatalog por section ("Empresa"/"Tecnico") y visibleToProvider=true
//   2. Para cada item del catálogo, buscar el doc en db.documents del proveedor actual
//   3. Mostrar checklist:
//      - Nombre del documento
//      - Obligatorio: badge
//      - Estado: chip wf-chip-* según status
//      - Vencimiento: si expiryDate existe, calcular días restantes
//        - < 15 días: badge rojo "Vence en X días"
//        - 15-30 días: badge amarillo "Vence en X días"
//        - > 30 días: texto gris
//      - Botón "Subir" si Pendiente o Rechazado
//      - Botón "Reemplazar" si Aprobado o Cargado
//      - Si Rechazado: mostrar validatorComment en rojo
//
// Al hacer clic en "Subir/Reemplazar":
//   toast.success("Documento cargado. Pendiente de revisión.")
//   Actualizar status a "Cargado" en db.documents (o crear nuevo doc si no existe)
//
// Tab REPSE: mantiene lógica existente si ya hay una, o simplemente redirige
//   a /proveedor/operacion/contratos con un mensaje explicativo

// Importa useAuthStore para obtener supplierId del usuario actual
```

---

## CRITERIO DE ACEPTACIÓN

1. Login `ag@demo.com` → `/app/config/documentos` → ver 13 docs en tabla, crear nuevo, editar, exportar CSV ✓
2. Login `pa@demo.com` → `/proveedor/documentos` → Tab "De la Empresa" muestra checklist con estados y alertas de vencimiento ✓
3. Login `ca@demo.com` → `/app/proveedores` → "Servicios Alpha" → Expediente → ver sección Empresa y Técnicos con docs ✓
4. `npx tsc --noEmit` sin errores ✓
