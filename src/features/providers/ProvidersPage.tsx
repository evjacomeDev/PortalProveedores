import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SupplierStatusBadge } from "../../components/common/StatusBadge";
import { createSupplier, generatePeriods, listSuppliers, updateSupplierStatus } from "../../mock/api";
import { db } from "../../mock/db";

export function ProvidersPage() {
  const [suppliers, setSuppliers] = useState(db.suppliers);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const refresh = async () => setSuppliers([...(await listSuppliers())]);

  const onCreate = async () => {
    if (!name.trim()) {
      toast.error("Indica el nombre del proveedor");
      return;
    }
    await createSupplier({ name: name.trim(), type: "General", shortReview: true, detailedReview: false });
    toast.success("Proveedor creado — correo simulado y evento en bitácora");
    setName("");
    refresh();
  };

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <h1 className="wf-page-title">Listado de proveedores REPSE</h1>

      <div className="wf-filters">
        <div className="wf-filters-row">
          <div className="wf-filter-group wf-filter-group-wide">
            <span className="wf-filter-label">Búsqueda</span>
            <input className="wf-input" placeholder="Nombre o RFC (demo)" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="wf-filter-group">
            <span className="wf-filter-label">Estatus</span>
            <select className="wf-input" defaultValue="">
              <option value="">Todos</option>
              <option>Activo</option>
              <option>Pre-registrado</option>
              <option>En revision</option>
            </select>
          </div>
          <div className="wf-filter-group">
            <span className="wf-filter-label">Tipo</span>
            <select className="wf-input" defaultValue="">
              <option value="">Todos</option>
              <option>Outsourcing</option>
              <option>Transporte</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="wf-btn wf-btn-primary">
            Buscar
          </button>
          <button type="button" className="wf-btn wf-btn-secondary">
            Limpiar
          </button>
        </div>
      </div>

      <div className="wf-kpi-row">
        {[
          { t: "Total proveedores", v: suppliers.length, dot: "wf-dot-blue" },
          { t: "Activos", v: suppliers.filter((s) => s.status === "Activo").length, dot: "wf-dot-green" },
          { t: "En revisión", v: suppliers.filter((s) => s.status === "En revision").length, dot: "wf-dot-yellow" },
          { t: "Bloqueados", v: suppliers.filter((s) => s.status === "Bloqueado").length, dot: "wf-dot-red" },
        ].map((k) => (
          <div key={k.t} className="wf-kpi-card">
            <span className={`wf-kpi-dot ${k.dot}`} />
            <div className="wf-kpi-title">{k.t}</div>
            <div className="wf-kpi-value">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="wf-actions-bar justify-between">
        <div className="flex flex-wrap gap-2">
          <input className="wf-input max-w-xs" placeholder="Nombre nuevo proveedor" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" className="wf-btn wf-btn-secondary" onClick={onCreate}>
            Alta proveedor
          </button>
          <button
            type="button"
            className="wf-btn wf-btn-primary"
            onClick={() => generatePeriods().then(() => toast.success("Periodos generados (contratos vigentes)"))}
          >
            Generar periodos
          </button>
        </div>
        <button type="button" className="wf-btn wf-btn-secondary" style={{ background: "#4caf50", borderColor: "#388e3c", color: "#fff" }}>
          Exportar (demo)
        </button>
      </div>

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Tipo</th>
                <th>Estatus</th>
                <th>Alta</th>
                <th>Revisiones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link className="font-semibold no-underline hover:underline" style={{ color: "#1565c0" }} to={`/app/proveedores/${s.id}`}>
                      {s.name}
                    </Link>
                  </td>
                  <td>{s.type}</td>
                  <td>
                    <SupplierStatusBadge status={s.status} />
                  </td>
                  <td>{s.createdAt}</td>
                  <td>
                    {s.shortReview ? "Corta " : ""}
                    {s.detailedReview ? "Detallada" : ""}
                    {!s.shortReview && !s.detailedReview ? "—" : ""}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <button type="button" className="wf-action-btn" onClick={() => updateSupplierStatus(s.id, "Activo").then(refresh)}>
                        Activar
                      </button>
                      <button type="button" className="wf-action-btn" onClick={() => updateSupplierStatus(s.id, "Bloqueado").then(refresh)}>
                        Bloquear
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
