import { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
=======
import { toast } from "sonner";
import { exportEvaluationDetailCSV, exportRankingCSV } from "../../mock/api";
>>>>>>> cfdacd9 (Cierre de demo commit)
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

<<<<<<< HEAD
=======
  // KPIs
  const evaluatedIds = new Set(db.evaluations.map((e) => e.supplierId));
  const evaluadosCount = evaluatedIds.size;
  const totalCount = db.suppliers.length;

  const latestBySupplier = db.suppliers
    .map((s) => latestScore(s.id))
    .filter(Boolean);
  const scorePromedio = latestBySupplier.length
    ? latestBySupplier.reduce((acc, ev) => acc + ev!.finalScore, 0) / latestBySupplier.length
    : 0;
  const enRiesgo = latestBySupplier.filter((ev) => ev!.finalScore < 70).length;

>>>>>>> cfdacd9 (Cierre de demo commit)
  return (
    <>
      <div className="wf-breadcrumb">
        Inicio / <strong>Ranking de proveedores</strong>
      </div>
      <h1 className="wf-page-title">Ranking por desempeño</h1>
<<<<<<< HEAD
=======

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="wf-card text-center">
          <p className="text-xs mb-1" style={{ color: "var(--wf-text-muted)" }}>Evaluados</p>
          <p className="text-2xl font-bold">{evaluadosCount} <span className="text-sm font-normal text-[#999]">/ {totalCount}</span></p>
        </div>
        <div className="wf-card text-center">
          <p className="text-xs mb-1" style={{ color: "var(--wf-text-muted)" }}>Score promedio</p>
          <p className="text-2xl font-bold">{scorePromedio.toFixed(1)}</p>
        </div>
        <div className="wf-card text-center">
          <p className="text-xs mb-1" style={{ color: "var(--wf-text-muted)" }}>En riesgo (score &lt; 70)</p>
          <p className="text-2xl font-bold" style={{ color: enRiesgo > 0 ? "#dc2626" : "inherit" }}>{enRiesgo}</p>
        </div>
      </div>

>>>>>>> cfdacd9 (Cierre de demo commit)
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
<<<<<<< HEAD
           <button type="button" className="wf-btn wf-btn-outline text-sm">Exportar (Excel)</button>
           <button type="button" className="wf-btn wf-btn-outline text-sm">Reporte Power BI</button>
        </div>
      </div>
      
=======
          <button type="button" className="wf-btn wf-btn-outline text-sm" onClick={exportRankingCSV}>
            Exportar (CSV / Excel)
          </button>
          <button
            type="button"
            className="wf-btn wf-btn-outline text-sm"
            onClick={() => { exportRankingCSV(); toast.success("CSV listo para importar en Power BI Desktop"); }}
          >
            Power BI
          </button>
        </div>
      </div>

>>>>>>> cfdacd9 (Cierre de demo commit)
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
<<<<<<< HEAD
=======
                <th>Próxima eval.</th>
>>>>>>> cfdacd9 (Cierre de demo commit)
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
<<<<<<< HEAD
=======
                  <td>{ev?.nextReviewDate ?? "—"}</td>
>>>>>>> cfdacd9 (Cierre de demo commit)
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
