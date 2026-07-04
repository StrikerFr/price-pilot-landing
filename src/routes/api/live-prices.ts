import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/mock";

export type LiveOffer = {
  store: string;
  price: number | null;
  url: string;
  initial: string;
  badgeClass: string;
};

export type LivePricesResponse = {
  id: string;
  offers: LiveOffer[];
  fetchedAt: number;
};

type Store = {
  name: string;
  domain: string;
  initial: string;
  badgeClass: string;
  fallbackSearch: (q: string) => string;
};

const STORES: Store[] = [
  {
    name: "Amazon",
    domain: "amazon.in",
    initial: "a",
    badgeClass: "bg-[oklch(0.94_0.05_75)] text-[oklch(0.42_0.14_45)]",
    fallbackSearch: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  },
  {
    name: "Flipkart",
    domain: "flipkart.com",
    initial: "F",
    badgeClass: "bg-[oklch(0.92_0.06_240)] text-[oklch(0.4_0.15_250)]",
    fallbackSearch: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: "Croma",
    domain: "croma.com",
    initial: "C",
    badgeClass: "bg-[oklch(0.92_0.08_25)] text-[oklch(0.42_0.15_25)]",
    fallbackSearch: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,
  },
  {
    name: "Reliance Digital",
    domain: "reliancedigital.in",
    initial: "R",
    badgeClass: "bg-[oklch(0.92_0.07_260)] text-[oklch(0.38_0.16_265)]",
    fallbackSearch: (q) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}:relevance`,
  },
  {
    name: "Vijay Sales",
    domain: "vijaysales.com",
    initial: "V",
    badgeClass: "bg-[oklch(0.93_0.06_140)] text-[oklch(0.4_0.14_150)]",
    fallbackSearch: (q) => `https://www.vijaysales.com/search/${encodeURIComponent(q)}`,
  },
];

const TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, LivePricesResponse>();

function extractPrice(...texts: (string | undefined | null)[]): number | null {
  for (const t of texts) {
    if (!t) continue;
    // Match ₹1,29,900 / ₹ 29999 / Rs. 24,990 / INR 42,999
    const re = /(?:₹|Rs\.?|INR)\s*([\d]{1,3}(?:[,\d]{2,})|\d{3,7})/gi;
    let m: RegExpExecArray | null;
    const candidates: number[] = [];
    while ((m = re.exec(t)) !== null) {
      const n = parseInt(m[1].replace(/,/g, ""), 10);
      if (Number.isFinite(n) && n >= 300 && n <= 5_000_000) candidates.push(n);
    }
    if (candidates.length) {
      // Prefer the smallest realistic price (usually the sale price, not MRP)
      return Math.min(...candidates);
    }
  }
  return null;
}

async function firecrawlSearch(query: string, apiKey: string, signal: AbortSignal) {
  const res = await fetch("https://api.firecrawl.dev/v2/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, limit: 3, sources: ["web"] }),
    signal,
  });
  if (!res.ok) return null;
  const json = (await res.json().catch(() => null)) as
    | { data?: { web?: Array<{ url?: string; title?: string; description?: string }> } }
    | null;
  return json?.data?.web ?? null;
}

async function fetchStore(
  store: Store,
  query: string,
  apiKey: string,
): Promise<LiveOffer> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 9000);
  try {
    const results = await firecrawlSearch(
      `${query} site:${store.domain} price`,
      apiKey,
      ctrl.signal,
    );
    if (results && results.length) {
      // Pick first result whose URL is on the store domain
      const hit =
        results.find((r) => (r.url ?? "").includes(store.domain)) ?? results[0];
      const price = extractPrice(hit?.title, hit?.description);
      return {
        store: store.name,
        price,
        url: hit?.url || store.fallbackSearch(query),
        initial: store.initial,
        badgeClass: store.badgeClass,
      };
    }
  } catch {
    /* fall through to fallback */
  } finally {
    clearTimeout(timeout);
  }
  return {
    store: store.name,
    price: null,
    url: store.fallbackSearch(query),
    initial: store.initial,
    badgeClass: store.badgeClass,
  };
}

export const Route = createFileRoute("/api/live-prices")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        const product = PRODUCTS.find((p) => p.id === id);
        if (!product) {
          return new Response(JSON.stringify({ error: "unknown product" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        const cached = cache.get(id);
        if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
          return Response.json(cached);
        }

        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
          const offers: LiveOffer[] = STORES.map((s) => ({
            store: s.name,
            price: null,
            url: s.fallbackSearch(`${product.brand} ${product.name}`),
            initial: s.initial,
            badgeClass: s.badgeClass,
          }));
          return Response.json({ id, offers, fetchedAt: Date.now() });
        }

        const query = `${product.brand} ${product.name}`;
        const offers = await Promise.all(
          STORES.map((s) => fetchStore(s, query, apiKey)),
        );

        const payload: LivePricesResponse = { id, offers, fetchedAt: Date.now() };
        cache.set(id, payload);
        return Response.json(payload, {
          headers: { "Cache-Control": "public, max-age=300" },
        });
      },
    },
  },
});
