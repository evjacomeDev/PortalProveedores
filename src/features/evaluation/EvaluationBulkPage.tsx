import { useRef, useState } from "react";
import { toast } from "sonner";
import { db } from "../../mock/db";
import { bulkImportEvaluations } from "../../mock/api";
import type { BulkEvaluationRow, BulkImportResult } from "../../mock/api";

// ── helpers ────────────────────────────────────────────────────────────────────

function buildExpectedKeys() {
  const cfg = db.evaluationConfig;
  return [
    ...cfg.criteria.A.map((c) => `A:${c}`),
    ...cfg.criteria.B.map((c) => `B:${c}`),
    ...cfg.criteria.C.map((c) => `C:${c}`),
  ];
}

function downloadTemplate() {
  const keys = buildExpectedKeys();
  const header = ["proveedor_id", "proveedor_nombre", ...keys].join(",");
  const activeSuppliers = db.suppliers.filter(
    (s) => s.status === "Activo" || s.status === "En riesgo"
  );
  const rows = activeSuppliers.map((s) => {
    const scores = keys.map(() => "").join(",");
    return `${s.id},${s.name},${scores}`;
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plantilla_evaluacion_masiva.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): BulkEvaluationRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const expectedKeys = buildExpectedKeys();
  const rawHeaders = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const supplierId = cells[rawHeaders.indexOf("proveedor_id")] ?? "";
    const supplierName =
      cells[rawHeaders.indexOf("proveedor_nombre")] ??
      db.suppliers.find((s) => s.id === supplierId)?.name ??
      supplierId;

    const errors: string[] = [];

    if (!supplierId) {
      errors.push("proveedor_id vacío");
    } else if (!db.suppliers.find((s) => s.id === supplierId)) {
      errors.push(`Proveedor "${supplierId}" no encontrado`);
    }

    const scores: Record<string, number> = {};
    for (const key of expectedKeys) {
      const idx = rawHeaders.indexOf(key);
      if (idx === -1) {
        errors.push(`Columna faltante: "${key}"`);
        continue;
      }
      const raw = cells[idx];
      const val = Number(raw);
      if (raw === "" || raw === undefined) {
        errors.push(`"${key}" vacío`);
      } else if (isNaN(val) || val < 1 || val > 5 || !Number.isInteger(val)) {
        errors.push(`"${key}" debe ser 1–5 (recibido: "${raw}")`);
      } else {
        scores[key] = val;
      }
    }

    return { supplierId, supplierName, scores, errors };
  });
}

function categoryColor(cat?: string) {
  if (!cat) return "var(--wf-text-muted)";
  if (cat === "EXCELENTE") return "#16a34a";
  if (cat === "CONFIABLE") return "#2563eb";
  if (cat === "REGULAR") return "#d97706";
  if (cat === "EN DESARROLLO") return "#ea580c";
  return "#dc2626";
}

// ── component ─────────────────────────────────────────────────────────────────

type Stage = "idle" | "preview" | "done";

export function EvaluationBulkPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [dragging, setDragging] = useState(false);
  const [rows, setRows] = useState<BulkEvaluationRow[]>([]);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [loading, setLoading] = useState(false);

  const cfg = db.evaluationConfig;
  const expectedKeys = buildExpectedKeys();

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      toast.error("El archivo debe ser .csv");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        toast.error("El archivo está vacío o no tiene filas de datos");
        return;
      }
      setRows(parsed);
      setStage("preview");
    };
    reader.readAsText(file, "utf-8");
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handleImport() {
    setLoading(true);
    try {
      const res = await bulkImportEvaluations(rows);
      setResult(res);
      setStage("done");
      toast.success(`${res.imported} evaluación(es) importada(s) correctamente`);
    } catch {
      toast.error("Error al importar las evaluaciones");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStage("idle");
    setRows([]);
    setResult(null);
  }

  const validRows = rows.filter((r) => r.errors.length === 0);
  const errorRows = rows.filter((r) => r.errors.length > 0);

  // ── render: idle ─────────────────────────────────────────────────────────────
  if (stage === "idle") {
    return (
      <div className="wf-page-content" style={{ maxWidth: 860 }}>
        <h1 className="wf-title">Carga masiva de evaluaciones</h1>
        <p className="wf-text-muted" style={{ marginBottom: 24 }}>
          Evalúa a múltiples proveedores simultáneamente subiendo un archivo CSV con los puntajes por criterio.
        </p>

        {/* Instructions */}
        <div className="wf-card" style={{ marginBottom: 24 }}>
          <h2 className="wf-subtitle" style={{ marginBottom: 12 }}>Instrucciones</h2>
          <ol style={{ paddingLeft: 20, lineHeight: 2, color: "var(--wf-text)" }}>
            <li>Descarga la plantilla CSV con los proveedores activos y las columnas de criterios.</li>
            <li>Llena los puntajes del <strong>1 al 5</strong> para cada criterio y proveedor.</li>
            <li>Sube el archivo aquí. El sistema validará cada fila antes de importar.</li>
            <li>Revisa la vista previa y confirma la importación.</li>
          </ol>

          <div style={{ marginTop: 16, background: "var(--wf-bg-muted)", borderRadius: 8, padding: "12px 16px" }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Columnas del CSV:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["proveedor_id", "proveedor_nombre", ...expectedKeys].map((k) => (
                <span key={k} className="wf-chip wf-chip-validating" style={{ fontSize: 11, fontFamily: "monospace" }}>
                  {k}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--wf-text-muted)", marginTop: 10 }}>
              Fases activas — <strong>A: {cfg.phaseLabels.A}</strong> ({cfg.weights.A * 100}%)&nbsp;·&nbsp;
              <strong>B: {cfg.phaseLabels.B}</strong> ({cfg.weights.B * 100}%)&nbsp;·&nbsp;
              <strong>C: {cfg.phaseLabels.C}</strong> ({cfg.weights.C * 100}%)
            </p>
          </div>

          <button
            type="button"
            className="wf-btn wf-btn-secondary"
            style={{ marginTop: 16 }}
            onClick={downloadTemplate}
          >
            ⬇ Descargar plantilla CSV
          </button>
        </div>

        {/* Drop zone */}
        <div
          className="wf-card"
          style={{
            border: `2px dashed ${dragging ? "var(--wf-primary)" : "var(--wf-border)"}`,
            background: dragging ? "var(--wf-bg-muted)" : undefined,
            textAlign: "center",
            padding: "48px 24px",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
            Arrastra tu archivo CSV aquí
          </p>
          <p style={{ color: "var(--wf-text-muted)", fontSize: 14, marginBottom: 16 }}>
            o haz clic para seleccionarlo
          </p>
          <button type="button" className="wf-btn wf-btn-primary" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
            Seleccionar archivo
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={onInputChange} />
        </div>
      </div>
    );
  }

  // ── render: preview ───────────────────────────────────────────────────────────
  if (stage === "preview") {
    return (
      <div className="wf-page-content" style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <h1 className="wf-title" style={{ margin: 0 }}>Vista previa — {rows.length} fila(s)</h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button type="button" className="wf-btn wf-btn-secondary" onClick={reset} disabled={loading}>
              Cancelar
            </button>
            <button
              type="button"
              className="wf-btn wf-btn-primary"
              onClick={handleImport}
              disabled={loading || validRows.length === 0}
            >
              {loading ? "Importando…" : `Confirmar importación (${validRows.length})`}
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <span className="wf-chip" style={{ background: "#dcfce7", color: "#166534" }}>
            ✓ {validRows.length} válidas
          </span>
          {errorRows.length > 0 && (
            <span className="wf-chip" style={{ background: "#fee2e2", color: "#991b1b" }}>
              ✗ {errorRows.length} con errores (se omitirán)
            </span>
          )}
        </div>

        <div className="wf-card" style={{ overflowX: "auto", padding: 0 }}>
          <table className="wf-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Proveedor</th>
                {expectedKeys.map((k) => (
                  <th key={k} style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                    {k}
                  </th>
                ))}
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ background: row.errors.length > 0 ? "#fff5f5" : undefined }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.supplierName}</div>
                    <div style={{ fontSize: 11, color: "var(--wf-text-muted)" }}>{row.supplierId}</div>
                  </td>
                  {expectedKeys.map((k) => {
                    const val = row.scores[k];
                    const hasErr = row.errors.some((e) => e.includes(`"${k}"`));
                    return (
                      <td key={k} style={{ textAlign: "center" }}>
                        {val !== undefined ? (
                          <span
                            className="wf-chip"
                            style={{
                              background: val >= 4 ? "#dcfce7" : val === 3 ? "#fef9c3" : "#fee2e2",
                              color: val >= 4 ? "#166534" : val === 3 ? "#854d0e" : "#991b1b",
                              fontWeight: 700,
                            }}
                          >
                            {val}
                          </span>
                        ) : (
                          <span style={{ color: hasErr ? "#dc2626" : "var(--wf-text-muted)", fontSize: 12 }}>
                            {hasErr ? "✗" : "—"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td>
                    {row.errors.length === 0 ? (
                      <span className="wf-chip" style={{ background: "#dcfce7", color: "#166534" }}>
                        ✓ OK
                      </span>
                    ) : (
                      <div>
                        {row.errors.map((err, j) => (
                          <div key={j} style={{ fontSize: 11, color: "#dc2626", whiteSpace: "nowrap" }}>
                            • {err}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── render: done ─────────────────────────────────────────────────────────────
  return (
    <div className="wf-page-content" style={{ maxWidth: 860 }}>
      <h1 className="wf-title">Importación completada</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div className="wf-card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#16a34a" }}>{result?.imported}</div>
          <div style={{ color: "var(--wf-text-muted)", fontSize: 13 }}>Importadas</div>
        </div>
        <div className="wf-card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#dc2626" }}>{result?.skipped}</div>
          <div style={{ color: "var(--wf-text-muted)", fontSize: 13 }}>Omitidas (errores)</div>
        </div>
        <div className="wf-card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{(result?.imported ?? 0) + (result?.skipped ?? 0)}</div>
          <div style={{ color: "var(--wf-text-muted)", fontSize: 13 }}>Total procesadas</div>
        </div>
      </div>

      {/* Result table */}
      <div className="wf-card" style={{ overflowX: "auto", padding: 0, marginBottom: 24 }}>
        <table className="wf-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Score final</th>
              <th>Categoría</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {result?.rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 600 }}>{row.supplierName}</div>
                  <div style={{ fontSize: 11, color: "var(--wf-text-muted)" }}>{row.supplierId}</div>
                </td>
                <td style={{ textAlign: "center", fontWeight: 700 }}>
                  {row.finalScore !== undefined ? `${row.finalScore.toFixed(1)}` : "—"}
                </td>
                <td>
                  {row.category ? (
                    <span style={{ fontWeight: 600, color: categoryColor(row.category) }}>
                      {row.category}
                    </span>
                  ) : "—"}
                </td>
                <td>
                  {row.errors.length === 0 ? (
                    <span className="wf-chip" style={{ background: "#dcfce7", color: "#166534" }}>
                      ✓ Importado
                    </span>
                  ) : (
                    <span className="wf-chip" style={{ background: "#fee2e2", color: "#991b1b" }}>
                      ✗ Omitido
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="wf-btn wf-btn-primary" onClick={reset}>
          Nueva carga
        </button>
        <a href="/app/ranking" className="wf-btn wf-btn-secondary">
          Ver ranking actualizado
        </a>
      </div>
    </div>
  );
}
