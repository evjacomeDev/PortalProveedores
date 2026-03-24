import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderPeriodsPage() {
  const user = useAuthStore((s) => s.user);
  const list = db.periods.filter((p) => p.supplierId === user?.supplierId);

  return (
    <>
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#0a2540] mb-2">Periodos REPSE</h1>
        <p className="text-base" style={{ color: "var(--wf-text-muted)" }}>
          Control de entrega mensual/bimestral de documentación para sus contratos de Servicios Especializados.
        </p>
      </div>
      
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Periodo Fiscal</th>
                <th>Vencimiento</th>
                <th>Progreso Documental</th>
                <th>Estatus</th>
                <th className="text-right">Acceso a Expediente</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                 const docs = db.documents.filter(d => d.periodId === p.id);
                 const totalDocs = docs.length || 6;
                 const approvedDocs = docs.filter(d => d.status === "Aprobado").length || (p.status === "Aprobado" ? 6 : p.status === "En captura" ? 2 : 5);
                 const percent = Math.round((approvedDocs / totalDocs) * 100);

                 return (
                   <tr key={p.id}>
                     <td className="font-bold text-[var(--wf-primary)]">{p.label}</td>
                     <td>{p.dueDate}</td>
                     <td>
                        <div className="flex flex-col gap-1 w-40">
                           <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                             <span>{approvedDocs} de {totalDocs} archivos</span>
                             <span>{percent}%</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${percent === 100 ? 'bg-[var(--wf-color-emerald)]' : percent > 50 ? 'bg-[var(--wf-color-amber)]' : 'bg-[#e63946]'}`} 
                                style={{ width: `${percent}%` }}
                              ></div>
                           </div>
                        </div>
                     </td>
                     <td>
                       <span className={`wf-chip ${p.status === "Aprobado" ? "wf-chip-approved" : p.status === "Vencido" ? "wf-chip-rejected" : p.status === "En validacion" ? "wf-chip-validating" : "wf-chip-preregistered"}`}>
                         {p.status}
                       </span>
                     </td>
                     <td className="text-right">
                       <Link className="wf-btn wf-btn-primary py-1.5 px-4 text-xs tracking-wide no-underline bg-[#0a2540] hover:bg-[#113a61] border-0" to={`/proveedor/expediente/${p.id}`}>
                         Ir al Expediente
                       </Link>
                     </td>
                   </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
