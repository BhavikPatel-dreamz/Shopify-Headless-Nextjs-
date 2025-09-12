"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchCustomer } from "@/lib/shopify";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
};

export default function OrdersPage() {
  const { isAuthenticated, accessToken } = useAuth();   
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      const customer = await fetchCustomer(accessToken);
      setOrders(customer?.orders?.nodes ?? []);
    })();
  }, [accessToken]);

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>
      <div className="divide-y rounded border">
        {orders.map((o) => (
          <Link key={o.id} href={`/account/orders/${encodeURIComponent(o.id)}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
            <div>
              <div className="text-sm">Order #{o.orderNumber}</div>
              <div className="text-xs text-muted-foreground">{new Date(o.processedAt).toLocaleString()}</div>
            </div>
            <div className="text-sm">
              {new Intl.NumberFormat(undefined, { style: "currency", currency: o.totalPriceSet.shopMoney.currencyCode }).format(Number(o.totalPriceSet.shopMoney.amount))}
            </div>
          </Link>
        ))}
      </div>
      {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
    </div>
  );
}


