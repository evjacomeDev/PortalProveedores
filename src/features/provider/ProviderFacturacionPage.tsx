import { useState } from "react";
import { Link } from "react-router-dom";

export function ProviderFacturacionPage() {
  const [invoices] = useState([
    { id: "FAC-001", uuid: "A1B2C3D4-1234", date: "2026-03-15", amount: "$45,000.00", status: "Pagada", docs: "XML / PDF" },
    { id: "FAC-002", uuid: "F9E8D7C6-5678", date: "2026-04-10", amount: "$12,500.00", status: "Programada", docs: "XML / PDF" },
    { id: "FAC-003", uuid: "B4C5D6E7-9012", date: "2026-04-20", amount: "$8,900.50", status: "En validación", docs: "XML / PDF" },
  ]);

  return (
    <>
      <div className="wf-breadcrumb">
        <Link className="wf-link-muted no-underline" to="/proveedor/home">
          Inicio
        </Link>{" "}
        / <strong>Buzón de Facturación</strong>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0a2540] mb-2">Historial de Facturas</h1>
          <p className="text-base" style={{ color: "var(--wf-text-muted)" }}>
            Sube tus facturas (XML y PDF) para procesar el pago o consulta el estatus de las ya enviadas.
          </p>
        </div>
        <button className="wf-btn tracking-wide font-semibold text-white bg-[#e63946] hover:bg-[#d62828] border-0 rounded-md px-6 py-3" onClick={() => alert("Simulación: Abriendo diálogo para adjuntar XML y PDF...")}>
          + Cargar Nueva Factura
        </button>
      </div>

      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Folio Interno</th>
                <th>UUID (Folio Fiscal)</th>
                <th>Fecha Emisión</th>
                <th className="text-right">Monto Neto</th>
                <th>Estatus de Pago</th>
                <th>Archivos Fiscales</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-semibold">{inv.id}</td>
                  <td className="text-xs text-gray-500 font-mono tracking-tighter">{inv.uuid}</td>
                  <td>{inv.date}</td>
                  <td className="font-semibold text-right">{inv.amount}</td>
                  <td>
                    <span
                      className={`wf-chip ${
                        inv.status === "Pagada"
                          ? "wf-chip-approved"
                          : inv.status === "Programada"
                            ? "wf-chip-validating"
                            : "wf-chip-preregistered"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <button className="wf-action-btn font-medium text-xs">{inv.docs}</button>
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
