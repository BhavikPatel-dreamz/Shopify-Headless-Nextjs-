"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchCustomer } from "@/lib/shopify";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

type Order = {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  lineItems?: { nodes: { title: string; quantity: number; originalTotalPrice: { amount: string; currencyCode: string } }[] };
};

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      const customer = await fetchCustomer(accessToken);
      const found = customer?.orders?.nodes?.find((o) => o.id === params.id) as unknown as Order | undefined;
      setOrder(found || null);
    })();
  }, [accessToken, params.id]);

  if (!isAuthenticated) return null;
  if (!order) return <div className="mx-auto max-w-3xl px-4 py-8">Order not found.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Orders", href: "/account/orders" }, { label: `#${order.orderNumber}` }]} />
      </div>
      <h1 className="mb-2 text-2xl font-semibold">Order #{order.orderNumber}</h1>
      <div className="text-sm text-muted-foreground mb-6">Placed on {new Date(order.processedAt).toLocaleString()}</div>
      <div className="rounded border p-4">
        {order.lineItems && order.lineItems.nodes.length > 0 && (
          <div className="mb-4 divide-y">
            {order.lineItems.nodes.map((li, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div>{li.title}</div>
                  <div className="text-xs text-muted-foreground">Qty {li.quantity}</div>
                </div>
                <div>
                  {new Intl.NumberFormat(undefined, { style: "currency", currency: li.originalTotalPrice.currencyCode }).format(Number(li.originalTotalPrice.amount))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat(undefined, { style: "currency", currency: order.totalPriceSet.shopMoney.currencyCode }).format(Number(order.totalPriceSet.shopMoney.amount))}
          </span>
        </div>
      </div>
    </div>
  );
}


