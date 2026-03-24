import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../mock/db";

function latestScore(supplierId: string) {
  const list = db.evaluations.filter((e) => e.supplierId === supplierId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list[0];
}

function getScoreBadge(score: number | undefined) {
  if (score === undefined || score < 0) return <span className="text-[#999]">—</span>;
  if (score >= 85) return <span className="wf-chip wf-chip-active px-2 py-1">{score.toFixed(1)}</span>;
  if (score >= 70) return <span className="wf-chip wf-chip-validating px-2 py-1">{score.toFixed(1)}</span>;
  return <span className="wf-chip wf-chip-blocked px-2 py-1">{score.toFixed(1)}</span>;
}

export function RankingPage() {
  const [filterCat, setFilterCat] = useState("Todas");

  const rows = db.suppliers
    .filter((s) => filterCat === "Todas" || s.type === filterCat)
    .map((s) => ({ s, ev: latestScore(s.id) }))
    .sort((a, b) => (b.ev?.finalScore ?? -1) - (a.ev?.finalScore ?? -1));

  return (
    <>
      <div className="wf-breadcrumb">
        Inicio / <strong>Ranking de proveedores</strong>
      </div>
      <h1 className="wf-page-title">Ranking por desempeño</h1>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
            Orden por score de evaluación (FR-47–48). Frecuencia de revisión depende del rating.
          </p>
          <div className="flex gap-2 mt-3">
            {["Todas", "MP", "ME", "Servicios"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`wf-btn ${filterCat === cat ? "wf-btn-primary" : "wf-btn-outline"} px-3 py-1 text-xs`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
           <button type="button" className="wf-btn wf-btn-outline text-sm">Exportar (Excel)</button>
           <button type="button" className="wf-btn wf-btn-outline text-sm">Reporte Power BI</button>
        </div>
      </div>
      
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Proveedor</th>
                <th>Categoría tipo</th>
                <th>Score</th>
                <th>Clasificación</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ s, ev }, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.type}</td>
                  <td>{getScoreBadge(ev?.finalScore)}</td>
                  <td>{ev?.category ?? "—"}</td>
                  <td>
                    <Link className="wf-action-btn no-underline" to={`/app/proveedores/${s.id}`}>
                      Ver Ficha
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <Link className="wf-btn wf-btn-primary no-underline" to="/app/dashboard">
          Volver al dashboard
        </Link>
      </div>
    </>
  );
}
