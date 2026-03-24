import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadRegistroDraft, saveRegistroDraft, type RegistroDraft } from "./wizardStorage";

const requeridos = ["Identificación fiscal", "Comprobante de domicilio", "Carátula bancaria"];

export function RegisterDocumentosPage() {
  const navigate = useNavigate();
  const [d, setD] = useState<RegistroDraft>(() => loadRegistroDraft());

  const toggle = (name: string) => {
    const set = new Set(d.documentosCargados);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    const next = { ...d, documentosCargados: [...set] };
    setD(next);
    saveRegistroDraft(next);
  };

  const onNext = () => {
    if (d.documentosCargados.length < requeridos.length) {
      toast.error("Marque todos los documentos como cargados (simulación)");
      return;
    }
    saveRegistroDraft(d);
    navigate("/registro/confirmacion");
  };

  return (
    <>
      <div className="wf-card">
        <h1 className="wf-page-title text-xl">Carga documental inicial</h1>
        <p className="mb-4 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Demo: marque cada ítem como cargado para simular el envío (FR-12).
        </p>
        <ul className="space-y-2">
          {requeridos.map((doc) => (
            <li key={doc} className="flex items-center justify-between gap-3 rounded border border-[#e5e5e5] bg-white px-3 py-2">
              <span className="text-sm font-medium">{doc}</span>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={d.documentosCargados.includes(doc)} onChange={() => toggle(doc)} />
                Cargado (mock)
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/registro/cuestionario">
          Anterior
        </Link>
        <button type="button" className="wf-btn wf-btn-primary ml-auto" onClick={onNext}>
          Siguiente
        </button>
      </div>
    </>
  );
}
