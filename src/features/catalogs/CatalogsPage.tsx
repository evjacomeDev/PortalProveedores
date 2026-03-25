<<<<<<< HEAD
export function CatalogsPage() {
  return (
    <>
      <h1 className="wf-page-title">Configuración documental</h1>
      <p className="mb-4 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Matriz de tipos documentales: etapas, periodicidad, obligatorio, formatos, plazos y visibilidad al proveedor (demo).
      </p>
      <div className="wf-filters mb-4">
        <span className="wf-filter-label">Pestañas (demo)</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="wf-btn wf-btn-secondary">
            Sociedades
          </button>
          <button type="button" className="wf-btn wf-btn-secondary">
            Tipos de servicio
          </button>
          <button type="button" className="wf-btn wf-btn-primary">
            Documentos REPSE
          </button>
        </div>
      </div>
=======
import { useState } from "react";
import { toast } from "sonner";
import { deleteCatalogItem, exportDocumentStatusCSV, saveCatalogItem } from "../../mock/api";
import { db } from "../../mock/db";
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

      <div className="flex gap-3 mb-4">
        <button type="button" className="wf-btn wf-btn-primary" onClick={openNew}>
          + Nuevo documento
        </button>
        <button type="button" className="wf-btn wf-btn-outline text-sm" onClick={exportDocumentStatusCSV}>
          Exportar estatus (CSV)
        </button>
      </div>

>>>>>>> cfdacd9 (Cierre de demo commit)
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
<<<<<<< HEAD
                <th>Etapa</th>
                <th>Periodicidad</th>
                <th>Obligatorio</th>
                <th>Formatos</th>
                <th>Plazo (días)</th>
                <th>Visible proveedor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Constancia REPSE</td>
                <td>Vigencia</td>
                <td>Anual</td>
                <td>Sí</td>
                <td>PDF</td>
                <td>10</td>
                <td>Sí</td>
              </tr>
              <tr>
                <td>XML Nómina</td>
                <td>Mensual</td>
                <td>Mensual</td>
                <td>Sí</td>
                <td>XML</td>
                <td>5</td>
                <td>Sí</td>
              </tr>
=======
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
>>>>>>> cfdacd9 (Cierre de demo commit)
            </tbody>
          </table>
        </div>
      </div>
<<<<<<< HEAD
=======

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
>>>>>>> cfdacd9 (Cierre de demo commit)
    </>
  );
}
