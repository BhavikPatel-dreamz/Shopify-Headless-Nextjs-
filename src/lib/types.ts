/*
 TypeScript domain models for Shopify Storefront API responses and app entities.
 These interfaces are intentionally verbose for clarity and future scalability.
*/

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string | null;
  price: Money;
  compareAtPrice?: Money | null;
  image?: Image | null;
  selectedOptions: SelectedOption[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  featuredImage?: Image | null;
  images: Image[];
  options: { id?: string; name: string; values: string[] }[];
  variants: { nodes: ProductVariant[] };
  tags?: string[];
  vendor?: string | null;
  productType?: string | null;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: Image | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: ProductVariant & { product: Pick<Product, "id" | "handle" | "title" | "featuredImage"> };
  cost: {
    totalAmount: Money;
  };
};

export type CartCost = {
  subtotalAmount: Money;
  totalAmount: Money;
  totalTaxAmount?: Money | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { nodes: CartLine[] };
  cost: CartCost;
};

export type Customer = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type CheckoutLineItem = {
  variantId: string;
  quantity: number;
};

export type ShopifyError = {
  message: string;
  extensions?: {
    code?: string;
    requestId?: string;
  };
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: ShopifyError[];
};

export type PaginationInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

export type ProductCollectionSortKey =
  | "TITLE"
  | "BEST_SELLING"
  | "CREATED"
  | "PRICE"
  | "ID";


