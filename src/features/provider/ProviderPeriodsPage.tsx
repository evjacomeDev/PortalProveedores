import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/store";
import { db } from "../../mock/db";

export function ProviderPeriodsPage() {
  const user = useAuthStore((s) => s.user);
  const list = db.periods.filter((p) => p.supplierId === user?.supplierId);

  return (
    <>
      <h1 className="wf-page-title">Mis periodos REPSE</h1>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Vencimiento</th>
                <th>Estatus</th>
                <th>Expediente</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold">{p.label}</td>
                  <td>{p.dueDate}</td>
                  <td>
                    <span className="wf-chip wf-chip-preregistered">{p.status}</span>
                  </td>
                  <td>
                    <Link className="wf-action-btn inline-block no-underline" to={`/proveedor/expediente/${p.id}`}>
                      Ver expediente
                    </Link>
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
