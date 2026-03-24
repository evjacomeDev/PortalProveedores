import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
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
                  <Cell key={i} fill={["#10b981", "#f59e0b", "#ef4444", "#3b82f6"][i % 4]} />
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
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="wf-chart-box mt-6" style={{ background: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--wf-border)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "1rem", color: "#333" }}>Evolución del Score Promedio (Últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={[
            { month: "Oct", score: 72 },
            { month: "Nov", score: 75 },
            { month: "Dic", score: 74 },
            { month: "Ene", score: 78 },
            { month: "Feb", score: 81 },
            { month: "Mar", score: 85 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
