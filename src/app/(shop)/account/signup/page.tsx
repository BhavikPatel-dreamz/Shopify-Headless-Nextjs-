"use client";
import { useState } from "react";
import { customerSignup } from "@/lib/shopify";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Create account</h1>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          setError(undefined);
          try {
            await customerSignup({ email, password, firstName, lastName });
            router.replace("/account/login");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            setError(err?.message || "Failed to sign up");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium">First name</label>
            <input className="w-full rounded border px-3 py-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Last name</label>
            <input className="w-full rounded border px-3 py-2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input className="w-full rounded border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Password</label>
          <input className="w-full rounded border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}


