# Headless Shopify Store (Next.js 14)

A production-ready headless Shopify storefront built with Next.js App Router, TypeScript, Tailwind CSS, Zustand, and the Shopify Storefront GraphQL API.

## Features
- Next.js 14 App Router with Server Components and ISR
- Shopify Storefront GraphQL API integration (typed)
- Product listing, product detail with gallery and variants
- Collections with sorting and search page with query param
- Cart: create/add/update/remove, persistent via localStorage, cart page and drawer
- Checkout redirect (native Shopify checkout)
- Customer auth: login, signup, recover/reset, account dashboard
- Orders: list and order detail view with line items
- Addresses: list, add/delete, set default, basic validation
- UI: shadcn/ui, lucide-react icons, Tailwind v4
- SEO: dynamic metadata, Open Graph, JSON-LD, sitemap and robots endpoints
- Performance: image optimization, memoized components, ISR
- Testing: Jest + @testing-library/react basic setup

## Tech Stack
- Next.js 14 (App Router), TypeScript strict
- Tailwind CSS (v4), shadcn/ui, lucide-react
- Zustand for state
- graphql-request for Storefront API calls

## Project Structure
src/
- app/
  - (shop)/
    - products/[handle]/
    - collections/[handle]/
    - cart/
    - search/
    - account/
      - login/
      - signup/
      - recover/
      - orders/
        - [id]/
      - addresses/
  - api/
    - session/
      - set/
      - clear/
  - layout.tsx
  - page.tsx
  - sitemap.ts
  - robots.ts
- components/
  - layout/
  - product/
  - cart/
  - seo/
  - ui/
- hooks/
- lib/
  - queries.ts
  - shopify.ts
  - types.ts
  - utils.ts
- stores/

## Requirements
- Node.js 18+ (Node 20+ recommended)
- A Shopify storefront with a Storefront API access token

## Environment Variables
Create a `.env.local` file in the project root with:
- NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
- NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
- SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token_if_needed
- NEXT_PUBLIC_SITE_URL=http://localhost:3000
- REVALIDATE_SECRET=your_secret_for_on_demand_isr

## Getting Started
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Open http://localhost:3000

## Scripts
- npm run dev — start dev server
- npm run build — production build
- npm start — run production server
- npm run lint — Next.js ESLint
- npm run format — Prettier format
- npm test — Jest unit tests

## Shopify API
- Storefront GraphQL version is pinned in `src/lib/shopify.ts`.
- The client implements retry with exponential backoff for 429/5xx.
- Queries/mutations in `src/lib/queries.ts`.

Implemented operations:
- Products: list, by handle
- Collections: by handle with sorting
- Search: products by text
- Cart: create, add lines, update lines, fetch cart
- Auth: customer token create/delete, fetch customer
- Customer: create, recover, reset
- Addresses: create, delete, set default

## State & Persistence
- Cart state: `src/stores/cartStore.ts` (Zustand + persist)
- Auth state: `src/stores/authStore.ts` (Zustand + persist)
- Customer session cookie `customerAccessToken` via:
  - POST `/api/session/set` ({ token, maxAge? })
  - POST `/api/session/clear`
- Middleware protects `/(shop)/account/*` based on this cookie

## UI & UX
- Header with cart badge and search
- Product pages: gallery, variant selection, add-to-cart
- Cart drawer and cart page with quantity controls and totals
- Account: login/signup/recover, dashboard, orders, order detail, addresses

## SEO
- Global metadata in `src/app/layout.tsx`
- Dynamic metadata in product/collection pages
- JSON-LD via `components/seo/JsonLd.tsx`
- `sitemap.ts` and `robots.ts`

## Performance
- Next/Image with `cdn.shopify.com`
- ISR for product, collection, search
- Memoized components for grids and cart lines

## Testing
- Jest + ts-jest + @testing-library/react
- Example test: `src/__tests__/utils.test.ts`

## Deployment (Vercel)
1. Push to a Git repo
2. Import in Vercel
3. Configure env vars (Preview & Prod):
   - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
   - NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
   - SHOPIFY_ADMIN_ACCESS_TOKEN (if used)
   - NEXT_PUBLIC_SITE_URL
   - REVALIDATE_SECRET
4. Build command: `npm run build`
5. Output: `.next`
6. Configure custom domain; ensure Shopify sales channel allows it

## GA4 (Optional)
- Add GA4 in `app/layout.tsx` with `next/script` and `NEXT_PUBLIC_GA_ID`.

## Roadmap / Next Steps
- Country/ZIP dataset validation (CLDR)
- Faceted search & filters
- Wishlist and reviews
- i18n and multi-currency
- Expanded tests (integration/E2E)

## Troubleshooting
- 429/5xx from Shopify: retries built-in; reduce request rate
- Images not loading: confirm `next.config.ts` allows `cdn.shopify.com`
- Env errors: verify `.env.local` and Vercel envs

## License
MIT
