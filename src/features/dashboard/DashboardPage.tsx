import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WireframePreview } from "../../components/common/WireframePreview";
import { db } from "../../mock/db";

export function DashboardPage() {
  const supplierData = [
    { name: "Al día", value: db.suppliers.filter((s) => s.status === "Activo").length },
    { name: "En riesgo", value: db.suppliers.filter((s) => s.status === "En riesgo").length },
    { name: "Bloqueado", value: db.suppliers.filter((s) => s.status === "Bloqueado").length },
    { name: "En revisión", value: db.suppliers.filter((s) => s.status === "En revision").length },
  ];
  const periodData = ["Abierto", "En captura", "En validacion", "Aprobado", "Vencido"].map((state) => ({
    state,
    total: db.periods.filter((p) => p.status === state).length,
  }));

  return (
    <>
      <h1 className="wf-page-title">Dashboard ejecutivo — Portal Proveedores</h1>

      <div className="wf-filters mb-6 flex min-h-[72px] flex-wrap items-end gap-4">
        <div className="wf-filter-group wf-filter-group-wide">
          <span className="wf-filter-label">Periodo (demo)</span>
          <input className="wf-input" placeholder="Ej. 2026-03" readOnly />
        </div>
        <div className="wf-filter-group">
          <span className="wf-filter-label">Proveedor</span>
          <input className="wf-input" placeholder="Buscar…" readOnly />
        </div>
        <button type="button" className="wf-btn wf-btn-primary ml-auto">
          Aplicar filtros
        </button>
      </div>

      <WireframePreview />

      <div className="wf-kpi-row">
        {supplierData.map((k, i) => (
          <div key={k.name} className="wf-kpi-card">
            <span className={`wf-kpi-dot ${["wf-dot-green", "wf-dot-yellow", "wf-dot-red", "wf-dot-blue"][i % 4]}`} />
            <div className="wf-kpi-title">{k.name}</div>
            <div className="wf-kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="wf-charts-row">
        <div className="wf-chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie dataKey="value" data={supplierData} nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {supplierData.map((_, i) => (
                  <Cell key={i} fill={["#666666", "#999999", "#c8c8c8", "#333333"][i % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="wf-chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={periodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#666666" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
