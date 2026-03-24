import { useState } from "react";

const wireframeFiles = Object.keys(import.meta.glob("/Wireframes/**/*.html"));

/** Toggle demo: comparar implementación con HTML de wireframe (misma carpeta del repo). */
export function WireframePreview() {
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState(wireframeFiles[0] ?? "");
  if (!wireframeFiles.length) return null;
  return (
    <div className="wf-card mb-5">
      <label className="mb-2 flex items-center gap-2 text-sm" style={{ color: "var(--wf-text-muted)" }}>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Modo demo: comparar con wireframe HTML
      </label>
      {enabled && (
        <div className="space-y-2">
          <select className="wf-input" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {wireframeFiles.map((f) => (
              <option key={f} value={f}>
                {f.replace("/Wireframes/", "")}
              </option>
            ))}
          </select>
          <iframe title="wireframe-preview" src={selected} className="h-80 w-full rounded border" style={{ borderColor: "var(--wf-border)" }} />
        </div>
      )}
    </div>
  );
}
