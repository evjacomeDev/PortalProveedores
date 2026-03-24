import { useState } from "react";
import { toast } from "sonner";
import { sendPeriodToValidation, uploadDoc } from "../../mock/api";
import { db } from "../../mock/db";
import { useAuthStore } from "../auth/store";

export function ProviderDocsPage() {
  const user = useAuthStore((s) => s.user);
  const myDocs = db.documents.filter((d) => d.supplierId === user?.supplierId);
  const firstPeriod = myDocs[0]?.periodId;
  const period = db.periods.find((p) => p.id === firstPeriod);

  const [fileHint, setFileHint] = useState("archivo.pdf");

  return (
    <>
      <h1 className="wf-page-title">Carga de documentos del periodo</h1>

      <div className="wf-card mb-6 bg-[#f8f8f8]">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <div className="text-[11px] uppercase" style={{ color: "#777" }}>
              Proveedor
            </div>
            <div className="text-sm font-medium">{user?.name}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase" style={{ color: "#777" }}>
              Periodo
            </div>
            <div className="text-sm font-medium">{period?.label ?? "—"}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase" style={{ color: "#777" }}>
              Estado
            </div>
            <div className="text-sm font-medium">{period?.status ?? "—"}</div>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Checklist según matriz REPSE y revisiones (demo). Simule la carga con el nombre de archivo.
      </p>

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Sección</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {myDocs.map((d) => (
                <tr key={d.id}>
                  <td className="font-medium">{d.documentType}</td>
                  <td>{d.section}</td>
                  <td>
                    <span
                      className={
                        d.status === "Aprobado"
                          ? "wf-chip wf-chip-active"
                          : d.status === "Rechazado"
                            ? "wf-chip wf-chip-blocked"
                            : "wf-chip wf-chip-validating"
                      }
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <input className="wf-input max-w-[140px] text-xs" value={fileHint} onChange={(e) => setFileHint(e.target.value)} aria-label="Nombre archivo demo" />
                      <button
                        type="button"
                        className="wf-action-btn"
                        onClick={() =>
                          uploadDoc({ periodId: d.periodId, documentId: d.id, fileName: fileHint }).then(() => toast.success("Archivo simulado guardado"))
                        }
                      >
                        Subir / reemplazar
                      </button>
                    </div>
                    {d.validatorComment && <p className="mt-1 text-xs text-red-700">Validador: {d.validatorComment}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {firstPeriod && (
        <div className="mt-6 flex justify-end">
          <button type="button" className="wf-btn wf-btn-primary" onClick={() => sendPeriodToValidation(firstPeriod).then(() => toast.success("Enviado a validación"))}>
            Enviar a validación
          </button>
        </div>
      )}
    </>
  );
}
