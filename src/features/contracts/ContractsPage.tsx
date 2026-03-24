import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { createContract, listContracts } from "../../mock/api";
import { db } from "../../mock/db";

export function ContractsPage() {
  const { id = "" } = useParams();
  const [contracts, setContracts] = useState(db.contracts.filter((c) => c.supplierId === id));
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ society: "Sociedad MX", service: "", startDate: "", endDate: "", amount: "", admin: "" });
  
  const supplier = db.suppliers.find((s) => s.id === id);

  const refresh = async () => setContracts(await listContracts(id));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service || !formData.startDate || !formData.endDate) {
      toast.error("Por favor completa los campos requeridos (Servicio, Inicio, Fin)");
      return;
    }
    try {
      await createContract({ 
        supplierId: id, 
        society: formData.society, 
        service: formData.service, 
        startDate: formData.startDate, 
        endDate: formData.endDate 
      });
      toast.success("Contrato registrado exitosamente");
      setFormData({ society: "Sociedad MX", service: "", startDate: "", endDate: "", amount: "", admin: "" });
      setShowForm(false);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline font-semibold" to="/app/proveedores">Proveedores</Link> / 
        {" "}<span className="text-gray-500">{supplier?.name ?? id}</span> / 
        <strong> Contratos</strong>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0a2540] mb-1">Gestión de contratos</h1>
          <p className="text-sm text-gray-500">Administra o registra nuevos contratos o asignaciones para {supplier?.name}</p>
        </div>
        {!showForm && (
          <button type="button" className="wf-btn tracking-wide font-semibold text-white bg-[#0a2540] hover:bg-[#113a61] border-0 px-5 py-2.5 shadow-sm" onClick={() => setShowForm(true)}>
            + Nuevo Contrato
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#0a2540] mb-4 border-b pb-2">Formulario de Alta de Contrato</h2>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sociedad Asignada <span className="text-[#e63946]">*</span></label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#0a2540] outline-none transition-shadow"
                  value={formData.society}
                  onChange={(e) => setFormData({...formData, society: e.target.value})}
                >
                  <option value="Sociedad MX">Sociedad MX (SAPI de CV)</option>
                  <option value="LATAM Corp">LATAM Corp (SA de CV)</option>
                  <option value="Servicios Comerciales">Servicios Comerciales Institucionales SC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción del Servicio / Insumo <span className="text-[#e63946]">*</span></label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#0a2540] outline-none transition-shadow"
                  placeholder="Ej. Limpieza, Mantenimiento preventivo, Insumos médicos..."
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio <span className="text-[#e63946]">*</span></label>
                <input 
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#0a2540] outline-none transition-shadow"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Vencimiento <span className="text-[#e63946]">*</span></label>
                <input 
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#0a2540] outline-none transition-shadow"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Monto Máximo (Opcional)</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#0a2540] outline-none transition-shadow"
                  placeholder="Ej. $1,500,000.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Administrador de Contrato (Opcional)</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#0a2540] outline-none transition-shadow"
                  placeholder="Nombre responsable interno"
                  value={formData.admin}
                  onChange={(e) => setFormData({...formData, admin: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
              <button 
                type="button" 
                className="font-semibold text-sm border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-md transition-colors"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="font-semibold text-sm text-white bg-[var(--wf-color-emerald)] hover:bg-green-700 border-0 px-6 py-2.5 rounded-md transition-colors shadow-sm"
              >
                Guardar Contrato
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Sociedad Asignada</th>
                <th>Descripción del Servicio</th>
                <th>Vigencia</th>
                <th>Estatus</th>
                <th className="text-right">Periodos</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">No hay contratos registrados para este proveedor.</td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold text-[#0a2540]">{c.society}</td>
                    <td>{c.service}</td>
                    <td>
                      {c.startDate} — {c.endDate}
                    </td>
                    <td>
                      <span className="wf-chip wf-chip-validating font-medium text-xs">{c.status || "En validacion"}</span>
                    </td>
                    <td className="text-right">
                      <Link className="font-semibold text-xs text-[#0a2540] underline hover:text-blue-700" to={`/app/contratos/${c.id}/periodos`}>
                        Ver periodos {'>'}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
