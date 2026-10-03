<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Yogures Cremosos — client storefront

Client-facing Next.js 16 storefront (`proyecto-yogurt/frontend/frontend-clientes`). UI copy and code comments are in **Spanish** — write new code/comments in Spanish. Sibling dirs: `backend/` (Go), `backend/openapi/client-openapi.yml` (the API contract this app mirrors), `frontend/frontend-admin`.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run lint` — eslint (whole repo)
- `npm run build` — the real typecheck/build gate (`tsc --noEmit` also works; no `typecheck` script)
- No test framework configured.

## Data layer — wired to the Go backend

`lib/api.ts` (server, React `cache()`) and `lib/client-api.ts` (client) call the backend Go API at `http://localhost:8080` (env `NEXT_PUBLIC_API_URL`, defaulted in code). Endpoints: `GET /api/products`, `POST/PUT /api/clientes/auth/profile`, `GET /api/clientes/order` (+ `/details`), `POST /api/clientes/order`, `POST /api/clientes/order/:orderId/paymentReceipt/`. Server fetches forward the `jwt` cookie via `cookies()`; client mutations use `credentials: "include"`. Contract notes: each product is a concrete size — `GET /api/products` returns rows with `size` ("pequeño"/"grande") and `relatedId` (links the two sizes of a flavor; ids are `{nombre}-{size}`, e.g. `yogur-fresa-pequeño`; the DB default for `related_id` is the text `'null'`, which `toProduct()` normalizes to `undefined` so "sin relación" no genera pares fantasma). The frontend groups them via `groupByFlavor()` in `lib/api.ts` (`ProductPair`), so the catalog shows one card per flavor. Profile has `phone` (no `direction`), order responses are snake_case (`user_id`, `receipt_img`, `created_at`, …) and the create-order response returns the order id in `message`. `NEXT_PUBLIC_API_URL` lives in gitignored `.env`/`.env.local`. There is no `GET /api/products/:id` on the Go backend — `getProduct(id)` filters the list. `getProducts()` is server-cached with `next: { revalidate: 60 }` — new/edited products appear only after up to 60s. The OpenAPI spec `backend/openapi/client-openapi.yml` mirrors the real backend routes and shapes — keep both in sync when the contract changes.

The **cart is purely client-side**: `lib/cart.tsx` (`CartProvider`/`useCart`, mounted in `app/layout.tsx`) persists to localStorage key `yogures-cremosos-cart`; there is no cart endpoint — it only materializes server-side at checkout via `createOrder()`. Cart items carry `productId` + `size`. Order reads are owner-scoped server-side: `GET /api/clientes/order/:orderId` and `/details` return 403 unless the order belongs to the current user (or the caller is admin) — the storefront only ever requests its own order ids.

## Auth: mock + real JWT

- `lib/session.ts`: authenticated if the cookie `jwt` (set by `LoginForm`/`RegisterForm`/`AutoLogin`/`lib/session-provider.tsx` after Supabase Auth) is present. `requireAuth()` only checks cookie presence — it does **not** validate the token against the backend (the backend guards each real API call; the client refreshes via `onAuthStateChange`). `getCurrentUserId()` decodes the `sub` claim.
- `lib/session-constants.ts` is imported from both client and server — never import `next/headers` there.
- Protected pages call `await requireAuth()` and set `export const dynamic = "force-dynamic"`.

## Supabase (auth + storage only)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_API_URL` come from gitignored `.env`/`.env.local`. `lib/supabase/client.ts` = browser client, `server.ts` = server client. Used for login/register and uploading payment receipts to the `payment_receipt` storage bucket (the uploaded path is sent to the backend as `receiptImg`). `next.config.ts` only allows remote images from `**.supabase.co` — adding another image host requires updating `images.remotePatterns` there.

## Stack specifics

- **Tailwind v4**: no `tailwind.config` — theme lives in `@theme` blocks in `app/globals.css` (custom palette: `morado`/`uva`/`lavanda`/`crema`).
- **shadcn style `base-nova` on Base UI** (`@base-ui/react`), *not* Radix. `components/ui/` holds the generated primitives; add new ones with `npx shadcn@latest add <name>`.
- Path alias `@/*` → repo root. Icons via `lucide-react`. Fonts via `next/font/google` (`Baloo_2`, `Nunito_Sans`) in `app/layout.tsx`.