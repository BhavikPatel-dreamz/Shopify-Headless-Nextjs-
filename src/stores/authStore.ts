"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { customerLogin, customerLogout, fetchCustomer } from "@/lib/shopify";

type Customer = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

type AuthState = {
  accessToken: string | null;
  customer: Customer | null;
  isLoading: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadCustomer: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      customer: null,
      isLoading: false,
      async login(email, password) {
        set({ isLoading: true, error: undefined });
        try {
          const token = await customerLogin(email, password);
          if (!token) throw new Error("Invalid credentials");
          set({ accessToken: token.accessToken });
          // set cookie session
          try {
            await fetch("/api/session/set", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: token.accessToken }) });
          } catch {}
          await get().loadCustomer();
        } catch (e: unknown) {
          const message = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : "Login failed";
          set({ error: message });
        } finally {
          set({ isLoading: false });
        }
      },
      async logout() {
        const token = get().accessToken;
        if (!token) return;
        try {
          await customerLogout(token);
        } finally {
          try {
            await fetch("/api/session/clear", { method: "POST" });
          } catch {}
          set({ accessToken: null, customer: null });
        }
      },
      async loadCustomer() {
        const token = get().accessToken;
        if (!token) return;
        try {
          const customer = await fetchCustomer(token);
          set({ customer: customer ? { id: customer.id, firstName: customer.firstName, lastName: customer.lastName, email: customer.email } : null });
        } catch {
          // ignore
        }
      },
    }),
    { name: "auth-store", partialize: (s) => ({ accessToken: s.accessToken, customer: s.customer }) }
  )
);


