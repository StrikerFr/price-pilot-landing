# PricePilot

AI-powered price comparison and product research for India. Compare prices across Amazon, Flipkart, Croma, Reliance Digital and more — with review analysis, price history, and drop alerts.

Built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and **Lovable Cloud**.

---

## Getting started

```bash
bun install
bun run dev
```

The app runs at `http://localhost:8080`.

### Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the Vite dev server with HMR |
| `bun run build` | Production build (defaults to Cloudflare target) |
| `bun run build:dev` | Development-mode production build (prerenders auth-safe routes) |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | ESLint |
| `bun run format` | Prettier write |

---

## Tech stack

- **Framework**: [TanStack Start](https://tanstack.com/start) v1 (React 19, file-based routing, SSR)
- **Bundler**: Vite 7 + Nitro (multi-target server runtime)
- **Styling**: Tailwind CSS v4 (CSS-first, `@theme` tokens in `src/styles.css`)
- **UI**: shadcn/ui + Radix primitives + lucide-react
- **Data**: TanStack Query
- **Forms**: react-hook-form + Zod
- **Backend**: Lovable Cloud (auth, database, edge functions)

### Project layout

```
src/
├── routes/            # File-based routes (pages + /api server routes)
│   ├── __root.tsx     # Root shell — head, providers, favicons
│   ├── index.tsx      # Landing page
│   └── api/           # Server routes (webhooks, public APIs)
├── components/        # Reusable UI (shadcn under components/ui/)
├── lib/               # Client-safe utilities & *.functions.ts (server fns)
├── integrations/      # Lovable Cloud / Supabase clients
├── assets/            # Static images imported by components
└── styles.css         # Tailwind entry + design tokens
```

---

## Deploying to Vercel

The project ships with a `vercel.json` that builds via the Nitro **vercel** preset — TanStack Start's SSR is served as Vercel serverless functions, and static assets are served from the edge automatically.

### Option 1 — Import from Git (recommended)

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Leave the framework preset as **Other** — `vercel.json` handles the build.
4. Add your environment variables (see below) in **Project Settings → Environment Variables**.
5. Click **Deploy**.

### Option 2 — Vercel CLI

```bash
bun add -g vercel
vercel           # first-time link + preview deploy
vercel --prod    # production deploy
```

### Environment variables

Copy your keys from Lovable Cloud (or your own Supabase project) into Vercel's dashboard:

| Name | Where used | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser + server | Public — exposed to client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Public — exposed to client |
| `SUPABASE_URL` | Server only | Same URL, used by server functions |
| `SUPABASE_PUBLISHABLE_KEY` | Server only | Same key, used by server functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | **Secret** — never expose to the browser |

Only `VITE_*` vars are shipped to the client. Everything else stays on the server.

### Build details

`vercel.json` runs:

```bash
NITRO_PRESET=vercel bun run build
```

This produces a `.vercel/output/` directory that Vercel serves directly — no extra adapter needed. If you don't use Bun, swap the commands to `npm install` / `npm run build` in `vercel.json`.

### Custom domains

Add a custom domain from **Project Settings → Domains** in Vercel and update DNS as instructed.

---

## Deploying elsewhere

Nitro supports many other targets out of the box — swap the preset:

| Target | Command |
| --- | --- |
| Cloudflare Workers (default) | `bun run build` |
| Netlify | `NITRO_PRESET=netlify bun run build` |
| Node server | `NITRO_PRESET=node-server bun run build` |
| Bun server | `NITRO_PRESET=bun bun run build` |

See [nitro.build/deploy](https://nitro.build/deploy) for the full list.

---

## Development notes

- **Routes**: create a file in `src/routes/` — the plugin generates `routeTree.gen.ts` automatically. Never edit that file by hand.
- **Server functions**: put them in `src/lib/*.functions.ts` and call from components via `useServerFn`. Never import `*.server.ts` from client code.
- **Design tokens**: colors, gradients, and fonts live in `src/styles.css` under `@theme` — never hardcode hex values in components.
- **SEO**: each route defines its own `head()` with title, description, and OG tags. `og:image` only on leaf routes.

---

## License

MIT
