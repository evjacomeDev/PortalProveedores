import { useState, Fragment } from "react";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderContractsPage() {
  const user = useAuthStore((s) => s.user);
  const list = db.contracts.filter((c) => c.supplierId === user?.supplierId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#0a2540] mb-2">Mis contratos asignados</h1>
        <p className="text-base" style={{ color: "var(--wf-text-muted)" }}>
          Detalle de sus asignaciones y acuerdos de nivel de servicio firmados vigentes e históricos.
        </p>
      </div>
      
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Sociedad asignada</th>
                <th>Descripción del Servicio</th>
                <th>Vigencia</th>
                <th>Estatus</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <Fragment key={c.id}>
                  <tr>
                    <td className="font-semibold text-[var(--wf-primary)]">{c.society}</td>
                    <td>{c.service}</td>
                    <td>
                      {c.startDate} — {c.endDate}
                    </td>
                    <td>
                      <span className={`wf-chip ${c.status === "Vigente" ? "wf-chip-approved" : c.status === "Vencido" ? "wf-chip-rejected" : "wf-chip-validating"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button 
                         className="wf-action-btn font-semibold"
                         onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                      >
                         {expandedId === c.id ? "Ocultar" : "Ver detalle >"}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === c.id && (
                    <tr className="bg-slate-50 shadow-inner">
                      <td colSpan={5} className="p-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm bg-white p-4 rounded-md border border-gray-200">
                            <div>
                               <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Monto Asignado</p>
                               <p className="font-medium text-gray-800 text-lg">$1,500,000.00 MXN</p>
                            </div>
                            <div>
                               <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Administrador de Contrato</p>
                               <p className="font-medium text-gray-800 text-lg">Ing. Roberto Sánchez</p>
                            </div>
                            <div>
                               <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Fianza de Cumplimiento</p>
                               <p className="font-medium text-[var(--wf-color-emerald)] text-lg">Garantía Activa (10%)</p>
                            </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
