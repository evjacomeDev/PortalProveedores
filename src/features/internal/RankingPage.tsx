import { Link } from "react-router-dom";
import { db } from "../../mock/db";

function latestScore(supplierId: string) {
  const list = db.evaluations.filter((e) => e.supplierId === supplierId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list[0];
}

export function RankingPage() {
  const rows = db.suppliers
    .map((s) => ({ s, ev: latestScore(s.id) }))
    .sort((a, b) => (b.ev?.finalScore ?? -1) - (a.ev?.finalScore ?? -1));

  return (
    <>
      <div className="wf-breadcrumb">
        Inicio / <strong>Ranking de proveedores</strong>
      </div>
      <h1 className="wf-page-title">Ranking por desempeño</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Orden por score de evaluación (FR-47–48). Solo usuarios internos.
      </p>
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
                  <td>{ev ? ev.finalScore.toFixed(1) : "—"}</td>
                  <td>{ev?.category ?? "—"}</td>
                  <td>
                    <Link className="wf-action-btn no-underline" to={`/app/proveedores/${s.id}`}>
                      Ficha
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
