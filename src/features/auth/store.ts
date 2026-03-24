import { create } from "zustand";
import { login as apiLogin } from "../../mock/api";
import type { Role, User } from "../../mock/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  loginByRole: (role: Role) => Promise<void>;
  loginByCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const SESSION_KEY = "portal_proveedores_demo_session";

const initialUser = (() => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  loading: false,
  loginByRole: async (role) => {
    set({ loading: true });
    const user = await apiLogin({ role });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user, loading: false });
  },
  loginByCredentials: async (email, password) => {
    set({ loading: true });
    const user = await apiLogin({ email, password });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user, loading: false });
  },
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },
}));
