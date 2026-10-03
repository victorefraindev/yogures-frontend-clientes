# Yogures Cremosos — Tienda (Next.js)

Tienda online del proyecto "Yogures Cremosos": catálogo de yogures agrupados por sabor (dos tamaños), carrito, checkout con fecha de entrega y comprobante de pago, historial de pedidos, perfil y notificaciones.

## Stack

- Next.js 16 (App Router), Tailwind CSS v4, Base UI (shadcn `base-nova`)
- Supabase (Auth + Storage) y API propia en Go

## Requisitos

- Node.js compatible con Next.js 16
- El backend corriendo (repo `yogures-backend`) en `http://localhost:8080`

## Puesta en marcha

```bash
npm install
# crear .env.local con las variables de abajo
npm run dev       # http://localhost:3000
```

Variables de entorno:

- `NEXT_PUBLIC_API_URL` — URL de la API (default `http://localhost:8080`).
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` — proyecto Supabase (auth + storage).

## Verificación

```bash
npm run build     # typecheck + build
npm run lint
```

## Despliegue

En Vercel: conectar el repo, definir las mismas variables de entorno (apuntando `NEXT_PUBLIC_API_URL` a la API desplegada) y listo. Los orígenes CORS de la API deben incluir el dominio del deploy.

## Probar desde otro dispositivo de la red (LAN)

Por defecto la app llama a la API en `http://localhost:8080`. Si la abrís desde otro dispositivo por tu IP privada, ese `localhost` apunta al otro dispositivo y falla. Para probar en LAN:

- En `.env.local`: `NEXT_PUBLIC_API_URL=http://<tu-IP-privada>:8080` y reiniciá el dev server.
- En `next.config.ts`: `allowedDevOrigins` debe incluir `http://<tu-IP-privada>:3000` (Next bloquea los chunks del dev server si no lo autorizás). Podés arrancar con `next dev -H 0.0.0.0`.
- En `backend/.env`: `CORS_ORIGIN_CLIENTES=http://<tu-IP-privada>:3000` (y `CORS_ORIGIN_ADMIN` para el panel).
- Recordá que es HTTP plano en tu red (el JWT viaja en claro) — solo para pruebas locales.

## Enlaces

- API: `yogures-backend`
- Panel admin: `yogures-admin`