import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderContractsPage() {
  const user = useAuthStore((s) => s.user);
  const list = db.contracts.filter((c) => c.supplierId === user?.supplierId);

  return (
    <>
      <h1 className="wf-page-title">Mis contratos</h1>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Sociedad</th>
                <th>Servicio</th>
                <th>Vigencia</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>{c.society}</td>
                  <td>{c.service}</td>
                  <td>
                    {c.startDate} — {c.endDate}
                  </td>
                  <td>
                    <span className="wf-chip wf-chip-validating">{c.status}</span>
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
