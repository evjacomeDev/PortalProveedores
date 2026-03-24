import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadRegistroDraft, saveRegistroDraft, type RegistroDraft } from "./wizardStorage";

function preguntasPorClasificacion(c: string): { id: string; label: string }[] {
  if (c.includes("Logística")) {
    return [
      { id: "cobertura", label: "¿Cobertura nacional?" },
      { id: "flota", label: "¿Cuenta con flota propia?" },
    ];
  }
  if (c.includes("Tecnología")) {
    return [
      { id: "cert", label: "¿Certificaciones de seguridad?" },
      { id: "sla", label: "¿SLA estándar ofrecido?" },
    ];
  }
  return [
    { id: "exp", label: "¿Años de experiencia en el sector?" },
    { id: "cap", label: "¿Capacidad instalada adecuada?" },
  ];
}

export function RegisterCuestionarioPage() {
  const navigate = useNavigate();
  const [d, setD] = useState<RegistroDraft>(() => loadRegistroDraft());
  const qs = useMemo(() => preguntasPorClasificacion(d.clasificacion || "Servicios"), [d.clasificacion]);

  const setAns = (id: string, value: string) => {
    const cuestionario = { ...d.cuestionario, [id]: value };
    const next = { ...d, cuestionario };
    setD(next);
    saveRegistroDraft(next);
  };

  const onNext = () => {
    const missing = qs.some((q) => !d.cuestionario[q.id]?.trim());
    if (missing) {
      toast.error("Responda todas las preguntas");
      return;
    }
    saveRegistroDraft(d);
    navigate("/registro/documentos");
  };

  if (!d.clasificacion) {
    return (
      <div className="wf-card">
        <p className="text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Primero complete la clasificación.
        </p>
        <Link className="wf-btn wf-btn-primary mt-4 inline-block no-underline" to="/registro/clasificacion">
          Ir a clasificación
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="wf-card">
        <h1 className="wf-page-title text-xl">Cuestionario ({d.clasificacion})</h1>
        <div className="mt-4 space-y-4">
          {qs.map((q) => (
            <div key={q.id} className="wf-form-group">
              <label className="wf-form-label">{q.label}</label>
              <input className="wf-form-input" value={d.cuestionario[q.id] ?? ""} onChange={(e) => setAns(q.id, e.target.value)} placeholder="Respuesta breve" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-secondary no-underline" to="/registro/clasificacion">
          Anterior
        </Link>
        <button type="button" className="wf-btn wf-btn-primary ml-auto" onClick={onNext}>
          Siguiente
        </button>
      </div>
    </>
  );
}
