import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "@/lib/api";
import type { UserRequestDTO } from "@/types";

interface JwtPayload {
  sub: string;
  exp: number;
}

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;

  login: (username: string, password: string) => Promise<void>;
  register: (data: UserRequestDTO) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: "guest-user",
  isAuthenticated: true,
  loading: false,
  error: null,
  isHydrated: true,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      await loginUser({ username, password });
      localStorage.setItem("username", username);
      set({
        username,
        isAuthenticated: true,
        loading: false,
        isHydrated: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await registerUser(data);
      set({ loading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("username");
    set({ username: null, isAuthenticated: false });
  },

  hydrate: () => {
    const username = localStorage.getItem("username");

    if (!username) {
      set({ isHydrated: true });
      return;
    }

    set({ username, isAuthenticated: true, isHydrated: true });
  },
}));
