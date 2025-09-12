"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { customerAddressCreate, customerAddressDelete, customerDefaultAddressUpdate } from "@/lib/shopify";

export default function AddressesPage() {
  const { isAuthenticated, accessToken, loadCustomer, customer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);
  if (!isAuthenticated || !accessToken) return null;
  type Address = { id: string; address1?: string; address2?: string; city?: string; zip?: string; country?: string };
  const addresses: Address[] = (customer as unknown as { addresses?: { nodes?: Address[] } })?.addresses?.nodes || [];
  const defaultId: string | undefined = (customer as unknown as { defaultAddress?: { id?: string } })?.defaultAddress?.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Addresses</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-medium">Saved addresses</h2>
          <div className="divide-y rounded border">
            
            {addresses.map((a) => (
              <div key={a.id} className="p-4">
                <div className="text-sm">
                  {a.address1} {a.address2}
                  <br />
                  {a.city}, {a.zip}
                  <br />
                  {a.country}
                </div>
                <div className="mt-2 flex gap-3 text-sm">
                  <button
                    className="underline"
                    disabled={isLoading || a.id === defaultId}
                    onClick={async () => {
                      if (!accessToken) return;
                      setIsLoading(true);
                      await customerDefaultAddressUpdate(accessToken, a.id);
                      await loadCustomer();
                      setIsLoading(false);
                    }}
                  >
                    {a.id === defaultId ? "Default" : "Set default"}
                  </button>
                  <button
                    className="text-red-600 underline"
                    disabled={isLoading}
                    onClick={async () => {
                      if (!accessToken) return;
                      setIsLoading(true);
                      await customerAddressDelete(accessToken, a.id);
                      await loadCustomer();
                      setIsLoading(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && <div className="p-4 text-sm text-muted-foreground">No addresses saved.</div>}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="font-medium">Add new address</h2>
          <AddressForm
            onSubmit={async (values) => {
              if (!accessToken) return;
              setIsLoading(true);
              await customerAddressCreate(accessToken, values);
              await loadCustomer();
              setIsLoading(false);
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

type AddressValues = { address1: string; address2?: string; city: string; zip: string; country: string };

function AddressForm({ onSubmit, isLoading }: { onSubmit: (values: AddressValues) => Promise<void>; isLoading: boolean }) {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | undefined>();
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(undefined);
        if (address1.trim().length < 3) {
          setError("Address must be at least 3 characters");
          return;
        }
        if (city.trim().length < 2) {
          setError("City is required");
          return;
        }
        if (!/^\w[\w\s-]{2,}$/.test(country)) {
          setError("Country is required");
          return;
        }
        if (!/^[\w-\s]{3,10}$/.test(zip)) {
          setError("ZIP looks invalid");
          return;
        }
        await onSubmit({ address1, address2, city, zip, country });
        setAddress1("");
        setAddress2("");
        setCity("");
        setZip("");
        setCountry("");
      }}
    >
      <div className="space-y-1">
        <label className="block text-sm">Address 1</label>
        <input className="w-full rounded border px-3 py-2" value={address1} onChange={(e) => setAddress1(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <label className="block text-sm">Address 2</label>
        <input className="w-full rounded border px-3 py-2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm">City</label>
        <input className="w-full rounded border px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm">ZIP</label>
          <input className="w-full rounded border px-3 py-2" value={zip} onChange={(e) => setZip(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Country</label>
          <select className="w-full rounded border px-3 py-2" value={country} onChange={(e) => setCountry(e.target.value)} required>
            <option value="">Select</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save address"}
      </button>
    </form>
  );
}


