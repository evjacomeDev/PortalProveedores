import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../../mock/db";
import { useAuthStore } from "../auth/store";

type Tab = "Empresa" | "Tecnico" | "REPSE";

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function ExpiryBadge({ expiryDate }: { expiryDate?: string }) {
  if (!expiryDate) return null;
  const days = daysUntil(expiryDate);
  if (days < 0) return <span className="wf-chip wf-chip-blocked text-xs">Vencido</span>;
  if (days < 15) return <span className="wf-chip wf-chip-blocked text-xs">Vence en {days}d</span>;
  if (days < 30) return <span className="wf-chip wf-chip-validating text-xs">Vence en {days}d</span>;
  return <span className="text-xs" style={{ color: "var(--wf-text-muted)" }}>Vence {expiryDate}</span>;
}

function statusChip(status: string) {
  if (status === "Aprobado") return "wf-chip-active";
  if (status === "Rechazado") return "wf-chip-blocked";
  if (status === "En revision") return "wf-chip-validating";
  if (status === "Cargado") return "wf-chip-validating";
  return "wf-chip-preregistered";
}

export function ProviderDocsPage() {
  const user = useAuthStore((s) => s.user);
  const sid = user?.supplierId ?? "";
  const [tab, setTab] = useState<Tab>("Empresa");
  const [, forceUpdate] = useState(0);

  const catalogItems = db.documentCatalog.filter(
    (c) => c.section === tab && c.visibleToProvider
  );

  function getDoc(catalogItemId: string) {
    return db.documents.find(
      (d) => d.supplierId === sid && d.catalogItemId === catalogItemId
    );
  }

  function handleUpload(catalogItemId: string, docName: string) {
    const existing = db.documents.find(
      (d) => d.supplierId === sid && d.catalogItemId === catalogItemId
    );
    const now = new Date().toISOString().slice(0, 10);
    const catalogItem = db.documentCatalog.find((c) => c.id === catalogItemId);
    const expiryDate = catalogItem && catalogItem.validityDays > 0
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + catalogItem.validityDays);
          return d.toISOString().slice(0, 10);
        })()
      : undefined;

    if (existing) {
      existing.status = "Cargado";
      existing.fileName = `${docName.replace(/\s+/g, "_").toLowerCase()}_nuevo.pdf`;
      existing.uploadedAt = now;
      if (expiryDate) existing.expiryDate = expiryDate;
    } else {
      const period = db.periods.find((p) => p.supplierId === sid);
      const contract = db.contracts.find((c) => c.supplierId === sid);
      db.documents.push({
        id: `d_new_${sid}_${catalogItemId}`,
        periodId: period?.id ?? "p1",
        contractId: contract?.id ?? "c1",
        supplierId: sid,
        documentType: docName,
        catalogItemId,
        section: tab as import("../../mock/types").DocumentSection,
        status: "Cargado",
        fileName: `${docName.replace(/\s+/g, "_").toLowerCase()}.pdf`,
        uploadedAt: now,
        ...(expiryDate ? { expiryDate } : {}),
      });
    }
    toast.success("Documento cargado. Pendiente de revisión.");
    forceUpdate((n) => n + 1);
  }

  // REPSE tab: redirect hint
  if (tab === "REPSE") {
    return (
      <>
        <h1 className="wf-page-title">Mis documentos</h1>
        <TabBar tab={tab} setTab={setTab} />
        <div className="wf-card mt-4">
          <p className="text-sm font-medium mb-2">Documentos REPSE</p>
          <p className="text-sm mb-4" style={{ color: "var(--wf-text-muted)" }}>
            Los documentos REPSE (Vigencia, Mensual, Cuatrimestral) se gestionan por periodo de contrato.
          </p>
          <Link className="wf-btn wf-btn-primary no-underline" to="/proveedor/operacion/contratos">
            Ir a mis contratos y periodos
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="wf-page-title">Mis documentos</h1>
      <TabBar tab={tab} setTab={setTab} />

      <div className="wf-table-wrap mt-4">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Obligatorio</th>
                <th>Estado</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {catalogItems.map((cat) => {
                const doc = getDoc(cat.id);
                const canUpload = !doc || doc.status === "Pendiente" || doc.status === "Rechazado";
                return (
                  <tr key={cat.id}>
                    <td>
                      <div className="font-medium text-sm">{cat.name}</div>
                      {cat.description && (
                        <div className="text-xs mt-0.5" style={{ color: "var(--wf-text-muted)" }}>{cat.description}</div>
                      )}
                      <div className="text-xs mt-0.5" style={{ color: "var(--wf-text-muted)" }}>
                        Formatos: {cat.allowedFormats.join(", ")}
                      </div>
                    </td>
                    <td>{cat.mandatory ? <span className="wf-chip wf-chip-active text-xs">Obligatorio</span> : <span className="text-xs text-[#999]">Opcional</span>}</td>
                    <td>
                      {doc ? (
                        <span className={`wf-chip ${statusChip(doc.status)} text-xs`}>{doc.status}</span>
                      ) : (
                        <span className="wf-chip wf-chip-preregistered text-xs">Pendiente</span>
                      )}
                    </td>
                    <td>
                      <ExpiryBadge expiryDate={doc?.expiryDate} />
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="wf-action-btn text-xs"
                          onClick={() => handleUpload(cat.id, cat.name)}
                        >
                          {canUpload ? "Subir" : "Reemplazar"}
                        </button>
                        {doc?.status === "Rechazado" && doc.validatorComment && (
                          <p className="text-xs text-red-700 mt-1">Validador: {doc.validatorComment}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {catalogItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm py-4" style={{ color: "var(--wf-text-muted)" }}>
                    Sin documentos en esta sección
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {(["Empresa", "Tecnico", "REPSE"] as Tab[]).map((t) => (
        <button
          key={t}
          type="button"
          className={`wf-btn ${tab === t ? "wf-btn-primary" : "wf-btn-secondary"} text-sm`}
          onClick={() => setTab(t)}
        >
          {t === "Empresa" ? "De la Empresa" : t === "Tecnico" ? "Técnicos" : "REPSE"}
        </button>
      ))}
    </div>
  );
}
