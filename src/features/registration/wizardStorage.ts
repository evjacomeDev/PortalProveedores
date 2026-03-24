const KEY = "portal_registro_wizard_v1";

export type RegistroDraft = {
  razonSocial: string;
  rfc: string;
  nombreComercial: string;
  contacto: string;
  correo: string;
  telefono: string;
  tipoProductoServicio: string;
  clasificacion: string;
  cuestionario: Record<string, string>;
  documentosCargados: string[];
};

export const defaultRegistroDraft = (): RegistroDraft => ({
  razonSocial: "",
  rfc: "",
  nombreComercial: "",
  contacto: "",
  correo: "",
  telefono: "",
  tipoProductoServicio: "",
  clasificacion: "",
  cuestionario: {},
  documentosCargados: [],
});

export function loadRegistroDraft(): RegistroDraft {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultRegistroDraft();
    return { ...defaultRegistroDraft(), ...JSON.parse(raw) };
  } catch {
    return defaultRegistroDraft();
  }
}

export function saveRegistroDraft(d: RegistroDraft) {
  sessionStorage.setItem(KEY, JSON.stringify(d));
}

export function clearRegistroDraft() {
  sessionStorage.removeItem(KEY);
}
