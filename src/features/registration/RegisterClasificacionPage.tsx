import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadRegistroDraft, saveRegistroDraft, type RegistroDraft } from "./wizardStorage";

const opciones = ["Servicios profesionales", "Suministros", "Logística", "Tecnología", "Otro"];

export function RegisterClasificacionPage() {
  const navigate = useNavigate();
  const [d, setD] = useState<RegistroDraft>(() => loadRegistroDraft());

  const onNext = () => {
    if (!d.clasificacion) {
      toast.error("Seleccione una clasificación");
      return;
    }
    saveRegistroDraft(d);
    navigate("/registro/cuestionario");
  };

  return (
    <>
      <div className="wf-card">
        <h1 className="wf-page-title text-xl">Clasificación</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Según la clasificación se mostrará un cuestionario distinto (FR-10, FR-11).
        </p>
        <div className="flex flex-col gap-2">
          {opciones.map((op) => (
            <label key={op} className="flex cursor-pointer items-center gap-2 rounded border border-[#ddd] bg-white px-4 py-3 text-sm">
              <input
                type="radio"
                name="clas"
                checked={d.clasificacion === op}
                onChange={() => {
                  const next = { ...d, clasificacion: op };
                  setD(next);
                  saveRegistroDraft(next);
                }}
              />
              {op}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/registro/datos">
          Anterior
        </Link>
        <button type="button" className="wf-btn wf-btn-primary ml-auto" onClick={onNext}>
          Siguiente
        </button>
      </div>
    </>
  );
}
