import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadRegistroDraft, saveRegistroDraft, type RegistroDraft } from "./wizardStorage";

export function RegisterDataPage() {
  const navigate = useNavigate();
  const [d, setD] = useState<RegistroDraft>(() => loadRegistroDraft());

  const update = (patch: Partial<RegistroDraft>) => {
    const next = { ...d, ...patch };
    setD(next);
    saveRegistroDraft(next);
  };

  const onNext = () => {
    if (!d.razonSocial.trim() || !d.rfc.trim() || !d.correo.trim()) {
      toast.error("Complete razón social, RFC y correo (demo)");
      return;
    }
    saveRegistroDraft(d);
    navigate("/registro/clasificacion");
  };

  const onDraft = () => {
    saveRegistroDraft(d);
    toast.success("Borrador guardado (solo en esta sesión)");
  };

  return (
    <>
      <div className="wf-card">
        <h1 className="wf-page-title text-xl">Datos generales del proveedor potencial</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--wf-text-muted)" }}>
          Captura mínima alineada al demo (FR-09). Los datos son mock y no se envían a un servidor real.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="wf-form-group md:col-span-2">
            <label className="wf-form-label">Razón social</label>
            <input className="wf-form-input" value={d.razonSocial} onChange={(e) => update({ razonSocial: e.target.value })} />
          </div>
          <div className="wf-form-group">
            <label className="wf-form-label">RFC</label>
            <input className="wf-form-input" value={d.rfc} onChange={(e) => update({ rfc: e.target.value })} />
          </div>
          <div className="wf-form-group">
            <label className="wf-form-label">Nombre comercial</label>
            <input className="wf-form-input" value={d.nombreComercial} onChange={(e) => update({ nombreComercial: e.target.value })} />
          </div>
          <div className="wf-form-group">
            <label className="wf-form-label">Contacto principal</label>
            <input className="wf-form-input" value={d.contacto} onChange={(e) => update({ contacto: e.target.value })} />
          </div>
          <div className="wf-form-group">
            <label className="wf-form-label">Correo</label>
            <input className="wf-form-input" type="email" value={d.correo} onChange={(e) => update({ correo: e.target.value })} />
          </div>
          <div className="wf-form-group">
            <label className="wf-form-label">Teléfono</label>
            <input className="wf-form-input" value={d.telefono} onChange={(e) => update({ telefono: e.target.value })} />
          </div>
          <div className="wf-form-group md:col-span-2">
            <label className="wf-form-label">Tipo de producto o servicio</label>
            <input className="wf-form-input" value={d.tipoProductoServicio} onChange={(e) => update({ tipoProductoServicio: e.target.value })} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="wf-btn wf-btn-secondary inline-flex items-center justify-center no-underline" to="/">
          Cancelar
        </Link>
        <button type="button" className="wf-btn wf-btn-secondary" onClick={onDraft}>
          Guardar borrador
        </button>
        <button type="button" className="wf-btn wf-btn-primary ml-auto" onClick={onNext}>
          Siguiente
        </button>
      </div>
    </>
  );
}
