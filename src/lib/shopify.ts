import { GraphQLClient } from "graphql-request";
import type { Product } from "./types";
import { QUERY_ALL_PRODUCTS, QUERY_PRODUCT_BY_HANDLE, MUTATION_CART_CREATE, MUTATION_CART_LINES_ADD, MUTATION_CART_LINES_UPDATE, QUERY_CART, QUERY_SEARCH_PRODUCTS, QUERY_COLLECTION_BY_HANDLE, MUTATION_CUSTOMER_ACCESS_TOKEN_CREATE, MUTATION_CUSTOMER_ACCESS_TOKEN_DELETE, QUERY_CUSTOMER, MUTATION_CUSTOMER_CREATE, MUTATION_CUSTOMER_RECOVER, MUTATION_CUSTOMER_RESET, MUTATION_CUSTOMER_ADDRESS_CREATE, MUTATION_CUSTOMER_ADDRESS_DELETE, MUTATION_CUSTOMER_DEFAULT_ADDRESS_UPDATE } from "./queries";
import type { Cart, ProductCollectionSortKey } from "./types";

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN as string;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;

if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
  // Throwing here helps fail-fast during development/deployment
  throw new Error("Missing Shopify environment variables.");
}

const API_ENDPOINT = `https://${STORE_DOMAIN}/api/2024-07/graphql.json`;

// Basic rate limiting backoff policy
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ShopifyApiClient {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(API_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
    });
  }

  // Generic request with retry and simple rate-limit handling
  async request<T>(query: string, variables?: Record<string, unknown>, attempt = 0): Promise<T> {
    try {
      const data = await this.client.request<T>(query, variables);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; headers?: Record<string, unknown> } };
      const status = err?.response?.status;
      const isRateLimited = status === 429 || (err?.response?.headers && "x-shopify-api-deprecated-reason" in err.response.headers);
      const isServerError = typeof status === "number" && status >= 500;
      if ((isRateLimited || isServerError) && attempt < 3) {
        const backoff = 250 * Math.pow(2, attempt);
        await sleep(backoff);
        return this.request<T>(query, variables, attempt + 1);
      }
      throw error;
    }
  }
}

export const shopifyClient = new ShopifyApiClient();

export async function fetchProducts(params?: { first?: number; after?: string | null }) {
  const first = params?.first ?? 12;
  const variables = { first, after: params?.after ?? null } as const;
  const data = await shopifyClient.request<{ products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } }>(
    QUERY_ALL_PRODUCTS,
    variables
  );
  return data.products;
}

export async function fetchProductByHandle(handle: string) {
  const data = await shopifyClient.request<{ product: Product | null }>(QUERY_PRODUCT_BY_HANDLE, { handle });
  return data.product;
}

export async function createCart(lines?: { merchandiseId: string; quantity: number }[]) {
  const variables = { lines: lines ?? [] } as const;
  const data = await shopifyClient.request<{ cartCreate: { cart: Cart | null; userErrors: { field?: string[]; message: string }[] } }>(
    MUTATION_CART_CREATE,
    variables
  );
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  }
  return data.cartCreate.cart as Cart;
}

export async function addLinesToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyClient.request<{ cartLinesAdd: { cart: Pick<Cart, "id" | "checkoutUrl" | "totalQuantity"> | null; userErrors: { message: string }[] } }>(
    MUTATION_CART_LINES_ADD,
    { cartId, lines }
  );
  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(", "));
  }
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await shopifyClient.request<{ cartLinesUpdate: { cart: Pick<Cart, "id" | "checkoutUrl" | "totalQuantity"> | null; userErrors: { message: string }[] } }>(
    MUTATION_CART_LINES_UPDATE,
    { cartId, lines }
  );
  if (data.cartLinesUpdate.userErrors?.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "));
  }
  return data.cartLinesUpdate.cart;
}

export async function fetchCart(cartId: string) {
  const data = await shopifyClient.request<{ cart: Cart | null }>(QUERY_CART, { cartId });
  return data.cart;
}

export async function searchProducts(query: string, params?: { first?: number; after?: string | null }) {
  const first = params?.first ?? 12;
  const variables = { first, after: params?.after ?? null, query } as const;
  const data = await shopifyClient.request<{ products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } }>(
    QUERY_SEARCH_PRODUCTS,
    variables
  );
  return data.products;
}

export async function fetchCollectionByHandle(handle: string, params?: { first?: number; after?: string | null; sortKey?: ProductCollectionSortKey | null; reverse?: boolean }) {
  const first = params?.first ?? 12;
  const variables: { first: number; after?: string | null; handle: string; sortKey?: ProductCollectionSortKey | null; reverse?: boolean } = {
    first,
    after: params?.after ?? null,
    handle,
    sortKey: params?.sortKey ?? null,
    reverse: params?.reverse ?? false,
  };
  const data = await shopifyClient.request<{ collection: { id: string; title: string; description?: string; image?: { url: string; altText?: string | null }; products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } | null }>(
    QUERY_COLLECTION_BY_HANDLE,
    variables
  );
  return data.collection;
}

// Customer auth
export async function customerLogin(email: string, password: string) {
  const data = await shopifyClient.request<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: { message: string }[];
    };
  }>(MUTATION_CUSTOMER_ACCESS_TOKEN_CREATE, { input: { email, password } });
  if (data.customerAccessTokenCreate.customerUserErrors?.length) {
    throw new Error(data.customerAccessTokenCreate.customerUserErrors.map((e) => e.message).join(", "));
  }
  return data.customerAccessTokenCreate.customerAccessToken;
}

export async function customerLogout(accessToken: string) {
  await shopifyClient.request(MUTATION_CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: accessToken });
}

export async function fetchCustomer(accessToken: string) {
  const data = await shopifyClient.request<{ customer: { id: string; firstName?: string | null; lastName?: string | null; email?: string | null; orders: { nodes: Array<{ id: string; orderNumber: number; processedAt: string; totalPriceSet: { shopMoney: { amount: string; currencyCode: string } } }> } } | null }>(
    QUERY_CUSTOMER,
    { customerAccessToken: accessToken }
  );
  return data.customer;
}

// Signup & password flows
export async function customerSignup(input: { email: string; password: string; firstName?: string; lastName?: string }) {
  const data = await shopifyClient.request<{
    customerCreate: { customer: { id: string } | null; customerUserErrors: { message: string }[] };
  }>(MUTATION_CUSTOMER_CREATE, { input });
  if (data.customerCreate.customerUserErrors?.length) {
    throw new Error(data.customerCreate.customerUserErrors.map((e) => e.message).join(", "));
  }
  return data.customerCreate.customer;
}

export async function customerRecover(email: string) {
  const data = await shopifyClient.request<{ customerRecover: { customerUserErrors: { message: string }[] } }>(MUTATION_CUSTOMER_RECOVER, { email });
  if (data.customerRecover.customerUserErrors?.length) {
    throw new Error(data.customerRecover.customerUserErrors.map((e) => e.message).join(", "));
  }
}

export async function customerReset(id: string, input: { password: string; resetToken: string }) {
  const data = await shopifyClient.request<{
    customerReset: { customer: { id: string } | null; customerUserErrors: { message: string }[] };
  }>(MUTATION_CUSTOMER_RESET, { id, input });
  if (data.customerReset.customerUserErrors?.length) {
    throw new Error(data.customerReset.customerUserErrors.map((e) => e.message).join(", "));
  }
  return data.customerReset.customer;
}

// Addresses
export async function customerAddressCreate(accessToken: string, address: { address1?: string; address2?: string; city?: string; zip?: string; country?: string }) {
  const data = await shopifyClient.request<{ customerAddressCreate: { customerUserErrors: { message: string }[] } }>(
    MUTATION_CUSTOMER_ADDRESS_CREATE,
    { customerAccessToken: accessToken, address }
  );
  if (data.customerAddressCreate.customerUserErrors?.length) {
    throw new Error(data.customerAddressCreate.customerUserErrors.map((e) => e.message).join(", "));
  }
}

export async function customerAddressDelete(accessToken: string, id: string) {
  const data = await shopifyClient.request<{ customerAddressDelete: { customerUserErrors: { message: string }[] } }>(
    MUTATION_CUSTOMER_ADDRESS_DELETE,
    { customerAccessToken: accessToken, id }
  );
  if (data.customerAddressDelete.customerUserErrors?.length) {
    throw new Error(data.customerAddressDelete.customerUserErrors.map((e) => e.message).join(", "));
  }
}

export async function customerDefaultAddressUpdate(accessToken: string, addressId: string) {
  const data = await shopifyClient.request<{ customerDefaultAddressUpdate: { customerUserErrors: { message: string }[] } }>(
    MUTATION_CUSTOMER_DEFAULT_ADDRESS_UPDATE,
    { customerAccessToken: accessToken, addressId }
  );
  if (data.customerDefaultAddressUpdate.customerUserErrors?.length) {
    throw new Error(data.customerDefaultAddressUpdate.customerUserErrors.map((e) => e.message).join(", "));
  }
}


