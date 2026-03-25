import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SupplierStatusBadge } from "../../components/common/StatusBadge";
import { createSupplier, generatePeriods, listSuppliers, updateSupplierStatus } from "../../mock/api";
import { db } from "../../mock/db";
import type { SupplierStatus } from "../../mock/types";

type Tab = "todos" | "potenciales" | "activos" | "riesgo";

const TAB_DEF: { key: Tab; label: string; statuses?: SupplierStatus[] }[] = [
  { key: "todos",       label: "Todos" },
  { key: "potenciales", label: "Potenciales", statuses: ["Pre-registrado", "En revision"] },
  { key: "activos",     label: "Activos",     statuses: ["Activo"] },
  { key: "riesgo",      label: "En riesgo / Bloqueados", statuses: ["En riesgo", "Bloqueado", "Inactivo"] },
];

const TIPOS = ["Todos", "MP", "ME", "Servicios", "General"];

function actionButtons(
  status: SupplierStatus,
  id: string,
  refresh: () => void,
) {
  const btn = (label: string, next: SupplierStatus, style?: string) => (
    <button
      key={next}
      type="button"
      className={`wf-action-btn ${style ?? ""}`}
      onClick={() => updateSupplierStatus(id, next).then(refresh)}
    >
      {label}
    </button>
  );

  switch (status) {
    case "Pre-registrado":
      return [btn("Activar", "Activo"), btn("Bloquear", "Bloqueado")];
    case "En revision":
      return [btn("Activar", "Activo"), btn("Bloquear", "Bloqueado")];
    case "Activo":
      return [btn("En riesgo", "En riesgo"), btn("Bloquear", "Bloqueado")];
    case "En riesgo":
      return [btn("Activar", "Activo"), btn("Bloquear", "Bloqueado")];
    case "Bloqueado":
      return [btn("Reactivar", "Activo")];
    case "Inactivo":
      return [btn("Reactivar", "Activo")];
    default:
      return [];
  }
}

export function ProvidersPage() {
  const [suppliers, setSuppliers] = useState(db.suppliers);
  const [tab, setTab] = useState<Tab>("todos");
  const [nameInput, setNameInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<SupplierStatus | "">("");
  const [filterTipo, setFilterTipo] = useState("Todos");

  const refresh = async () => setSuppliers([...(await listSuppliers())]);

  const onCreate = async () => {
    if (!nameInput.trim()) { toast.error("Indica el nombre del proveedor"); return; }
    await createSupplier({ name: nameInput.trim(), type: "General", shortReview: true, detailedReview: false });
    toast.success("Proveedor creado — correo simulado y evento en bitácora");
    setNameInput("");
    refresh();
  };

  const tabStatuses = TAB_DEF.find((t) => t.key === tab)?.statuses;

  const filtered = suppliers.filter((s) => {
    const matchTab    = !tabStatuses || tabStatuses.includes(s.status);
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || s.status === filterStatus;
    const matchTipo   = filterTipo === "Todos" || s.type === filterTipo;
    return matchTab && matchSearch && matchStatus && matchTipo;
  });

  const kpis = [
    { t: "Total",           v: suppliers.length,                                               dot: "wf-dot-blue" },
    { t: "Pre-registrado",  v: suppliers.filter((s) => s.status === "Pre-registrado").length,  dot: "wf-dot-yellow", tab: "potenciales" as Tab },
    { t: "En revisión",     v: suppliers.filter((s) => s.status === "En revision").length,     dot: "wf-dot-yellow", tab: "potenciales" as Tab },
    { t: "Activos",         v: suppliers.filter((s) => s.status === "Activo").length,          dot: "wf-dot-green" },
    { t: "En riesgo",       v: suppliers.filter((s) => s.status === "En riesgo").length,       dot: "wf-dot-red" },
    { t: "Bloqueados",      v: suppliers.filter((s) => s.status === "Bloqueado").length,       dot: "wf-dot-red" },
  ];

  return (
    <>
      <h1 className="wf-page-title">Listado de proveedores REPSE</h1>

      {/* KPIs — clic en potenciales cambia tab */}
      <div className="wf-kpi-row mb-6">
        {kpis.map((k) => (
          <div
            key={k.t}
            className={`wf-kpi-card ${k.tab ? "cursor-pointer hover:ring-2 hover:ring-[var(--wf-primary)]" : ""}`}
            onClick={() => k.tab && setTab(k.tab)}
            title={k.tab ? `Ver ${k.t}` : undefined}
          >
            <span className={`wf-kpi-dot ${k.dot}`} />
            <div className="wf-kpi-title">{k.t}</div>
            <div className="wf-kpi-value">{k.v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TAB_DEF.map((t) => {
          const count = t.statuses
            ? suppliers.filter((s) => t.statuses!.includes(s.status)).length
            : suppliers.length;
          const isActive = tab === t.key;
          const highlight = t.key === "potenciales" && count > 0;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`wf-btn text-sm ${isActive ? "wf-btn-primary" : "wf-btn-secondary"}`}
              style={highlight && !isActive ? { borderColor: "#f59e0b", color: "#92400e" } : undefined}
            >
              {t.label}
              <span
                className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: isActive ? "rgba(255,255,255,0.25)" : "var(--wf-bg-sidebar-item)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alerta potenciales */}
      {tab === "potenciales" && filtered.length > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-md border p-3 text-sm"
          style={{ background: "#fffbeb", borderColor: "#fbbf24", color: "#78350f" }}>
          <span className="text-base">⚠</span>
          <div>
            <strong>{filtered.length} proveedor{filtered.length > 1 ? "es" : ""}</strong> pendiente{filtered.length > 1 ? "s" : ""} de revisión.
            Revisa su expediente y usa <strong>Activar</strong> o <strong>Bloquear</strong> para actualizar su estatus.
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="wf-filters mb-4">
        <div className="wf-filters-row flex-wrap gap-3">
          <div className="wf-filter-group wf-filter-group-wide">
            <span className="wf-filter-label">Búsqueda</span>
            <input
              className="wf-input"
              placeholder="Nombre del proveedor"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="wf-filter-group">
            <span className="wf-filter-label">Estatus</span>
            <select
              className="wf-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SupplierStatus | "")}
            >
              <option value="">Todos</option>
              <option value="Pre-registrado">Pre-registrado</option>
              <option value="En revision">En revisión</option>
              <option value="Activo">Activo</option>
              <option value="En riesgo">En riesgo</option>
              <option value="Bloqueado">Bloqueado</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="wf-filter-group">
            <span className="wf-filter-label">Tipo</span>
            <select
              className="wf-input"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="button" className="wf-btn wf-btn-primary"
              onClick={() => { /* ya filtra en vivo */ toast.success("Filtros aplicados"); }}>
              Buscar
            </button>
            <button type="button" className="wf-btn wf-btn-secondary"
              onClick={() => { setSearch(""); setFilterStatus(""); setFilterTipo("Todos"); }}>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Barra de acciones */}
      <div className="wf-actions-bar justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <input
            className="wf-input max-w-xs"
            placeholder="Nombre nuevo proveedor"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button type="button" className="wf-btn wf-btn-secondary" onClick={onCreate}>
            + Alta proveedor
          </button>
          <button
            type="button"
            className="wf-btn wf-btn-primary"
            onClick={() => generatePeriods().then(() => toast.success("Periodos generados (contratos vigentes)"))}
          >
            Generar periodos
          </button>
        </div>
        <button
          type="button"
          className="wf-btn wf-btn-secondary"
          style={{ background: "#4caf50", borderColor: "#388e3c", color: "#fff" }}
        >
          Exportar (demo)
        </button>
      </div>

      {/* Tabla */}
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
                    Sin proveedores con estos filtros
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} style={
                  s.status === "Pre-registrado" || s.status === "En revision"
                    ? { background: "#fffbeb" }
                    : undefined
                }>
                  <td>
                    <Link
                      className="font-semibold no-underline hover:underline"
                      style={{ color: "#1565c0" }}
                      to={`/app/proveedores/${s.id}`}
                    >
                      {s.name}
                    </Link>
                    {(s.status === "Pre-registrado" || s.status === "En revision") && (
                      <span className="ml-2 text-xs font-bold" style={{ color: "#b45309" }}>⚠ Pendiente</span>
                    )}
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
                      <Link
                        className="wf-action-btn no-underline"
                        to={`/app/proveedores/${s.id}`}
                      >
                        Ver ficha
                      </Link>
                      {actionButtons(s.status, s.id, refresh)}
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
