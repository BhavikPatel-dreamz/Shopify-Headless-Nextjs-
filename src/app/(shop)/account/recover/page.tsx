"use client";
import { useState } from "react";
import { customerRecover } from "@/lib/shopify";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Reset your password</h1>
      {sent ? (
        <p className="text-sm">If an account exists for {email}, you will receive an email with reset instructions.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setError(undefined);
            try {
              await customerRecover(email);
              setSent(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              setError(err?.message || "Failed to send reset email");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium">Email</label>
            <input className="w-full rounded border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}


