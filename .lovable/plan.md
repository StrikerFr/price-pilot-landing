# PricePilot — Full Product Build Plan

Right now the project only has `/` (landing) and `/deals`. Everything else in the navbar is a dead link. This plan expands PricePilot into a complete, cohesive editorial product using the same warm-bright design language, typography, motion and interaction patterns already established.

Because this is a large body of work, I want to align on scope + sequencing before I spend hours building. **Please tell me if you want all of it, or a specific slice first.**

---

## Global (built once, used everywhere)

1. **Shared navbar + mega menus** — extract the current landing nav into `src/components/site/Navbar.tsx`. Sticky, scroll-blur, active route indicator, animated underline, magnetic hover.
   - `Categories` → Apple-Store-style two-column mega menu (9 categories, icon + description + trending products + hover image).
   - `Deals` → quick categories flyout.
   - `AI Assistant` → prompt suggestions flyout.
   - `News` → latest headlines flyout.
2. **Command palette search** (`⌘K` / click search icon) — full-screen glass blur, instant suggestions, recent, trending, keyboard nav, ESC to close.
3. **Page transitions** — Framer Motion `AnimatePresence` at the root route (fade + subtle scale + blur, premium easing).
4. **Custom cursor + magnetic buttons** (desktop only, respects `prefers-reduced-motion`).
5. **Loading screen** — PricePilot wordmark reveal with animated progress + subtle particles, shown on first load.
6. **Shared footer** already exists — reuse.
7. **Mobile nav** — full-screen animated sheet, large touch targets, bottom-sheet flyouts.

## New pages

Each page follows the same editorial rhythm: oversized hero, warm tokens, generous whitespace, scroll reveals, large photography, no dashboard/marketplace feel.

| Route | Key sections |
|---|---|
| `/categories` | Editorial hero, 9 category spotlights (large imagery, trending in each), "Shop by use case" strip |
| `/categories/$slug` | Category hero, curated picks, price-range explorer, AI category guide |
| `/compare` | Big product picker (2–4 slots), animated specs table, radar chart, AI verdict, pros/cons, price comparison, "Best for" recommendations |
| `/price-drops` | Live ticker hero, today's biggest drops, animated price-history charts, lowest-ever badges, filters (Today/Week/Month/Category/Brand), AI "worth it?" verdict per drop |
| `/sales-calendar` | Horizontal draw-in timeline, event cards with countdowns, expected discount %, products likely to drop, hover parallax |
| `/news` | Magazine layout: featured article, editorial grid, AI summaries, upcoming releases rail, trending products |
| `/ai-assistant` | Perplexity-style hero, massive input, suggested prompts, sample conversation with source cards + product recs, recent searches |
| `/product/$id` | Huge gallery, spec table, AI summary, pros/cons, review intelligence, price history, store comparison, alternatives, Buy-Now-or-Wait verdict |
| `/profile` | Minimal editorial profile: wishlist preview, saved searches, price alerts, browsing history, notification prefs |
| `/wishlist` | Grid of saved products, current vs lowest price, AI rec, "Notify me" |

All product / deal / news data is local mock data in `src/lib/mock/` so pages feel populated without a backend.

## Technical details

- Add `framer-motion` (if not already) via `bun add framer-motion`.
- Extract shared primitives: `Navbar`, `MegaMenu`, `CommandPalette`, `PageTransition`, `Cursor`, `LoadingScreen`, `SectionReveal`, `MagneticButton` under `src/components/site/`.
- Wire `AnimatePresence` in `src/routes/__root.tsx` around `<Outlet />`.
- Each route file sets its own `head()` (title, description, og).
- Reuse existing tokens in `src/styles.css`; only add tokens if a page needs something genuinely new (e.g. chart colors).
- Charts: lightweight hand-rolled SVG (matches the editorial feel better than Recharts).
- Respect `prefers-reduced-motion` throughout.

## Suggested sequencing (in case you want it staged)

**Phase 1 — Foundation** (unlocks everything else)
Shared Navbar + mega menus, command-palette search, page transitions, loading screen, cursor, mobile nav.

**Phase 2 — Core product pages**
`/compare`, `/price-drops`, `/product/$id`.

**Phase 3 — Editorial pages**
`/categories` (+ `/categories/$slug`), `/sales-calendar`, `/news`, `/ai-assistant`.

**Phase 4 — Personal**
`/profile`, `/wishlist`.

---

## Before I start

Two quick calls I'd like from you so I don't build the wrong thing:

1. **Scope**: build all four phases in one go, or start with Phase 1 + Phase 2 and iterate?
2. **AI Assistant**: should the chat actually call an LLM (I'd wire it through Lovable AI Gateway with `google/gemini-3-flash-preview`), or stay as a beautifully faked demo conversation for now?

Reply with your preference (or just "go, all of it, faked AI" / "go, all of it, real AI") and I'll execute.
