"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { isAuthenticated, loadCustomer, customer, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) router.replace("/account/login");
    else loadCustomer();
  }, [isAuthenticated, loadCustomer, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My account</h1>
        <button onClick={() => logout()} className="text-sm underline">Sign out</button>
      </div>
      <div className="rounded border p-4">
        <div className="text-sm">Name: {customer?.firstName} {customer?.lastName}</div>
        <div className="text-sm">Email: {customer?.email}</div>
      </div>
    </div>
  );
}


