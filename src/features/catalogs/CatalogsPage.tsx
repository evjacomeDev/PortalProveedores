export function CatalogsPage() {
  return (
    <>
      <h1 className="wf-page-title">Configuración documental</h1>
      <p className="mb-4 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        Matriz de tipos documentales: etapas, periodicidad, obligatorio, formatos, plazos y visibilidad al proveedor (demo).
      </p>
      <div className="wf-filters mb-4">
        <span className="wf-filter-label">Pestañas (demo)</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="wf-btn wf-btn-secondary">
            Sociedades
          </button>
          <button type="button" className="wf-btn wf-btn-secondary">
            Tipos de servicio
          </button>
          <button type="button" className="wf-btn wf-btn-primary">
            Documentos REPSE
          </button>
        </div>
      </div>
      <div className="wf-table-wrap">
        <div className="wf-table-scroll">
          <table className="wf-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Etapa</th>
                <th>Periodicidad</th>
                <th>Obligatorio</th>
                <th>Formatos</th>
                <th>Plazo (días)</th>
                <th>Visible proveedor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Constancia REPSE</td>
                <td>Vigencia</td>
                <td>Anual</td>
                <td>Sí</td>
                <td>PDF</td>
                <td>10</td>
                <td>Sí</td>
              </tr>
              <tr>
                <td>XML Nómina</td>
                <td>Mensual</td>
                <td>Mensual</td>
                <td>Sí</td>
                <td>XML</td>
                <td>5</td>
                <td>Sí</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
