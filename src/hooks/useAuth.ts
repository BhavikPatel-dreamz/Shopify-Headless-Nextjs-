"use client";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { accessToken, customer, isLoading, error, login, logout, loadCustomer } = useAuthStore();
  const isAuthenticated = Boolean(accessToken);
  return { accessToken, customer, isAuthenticated, isLoading, error, login, logout, loadCustomer };
}


