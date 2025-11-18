import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Engineer {
  id: number;
  name: string;
  mobile: string;
}

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  engineer: Engineer | null;

  setAuthData: (authResponse: {
    token: string;
    username: string;
    role: string;
    engineer: Engineer;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      engineer: null,
      setAuthData: ({ token, username, role, engineer }) =>
        set({ token, username, role, engineer }),
      clearAuth: () =>
        set({
          token: null,
          username: null,
          role: null,
          engineer: null,
        }),
    }),
    {
      name: "auth-storage", // key in localStorage
    },
  ),
);
