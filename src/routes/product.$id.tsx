import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, Reveal } from "@/components/site/PageShell";
import { PRODUCTS, inr } from "@/lib/mock";
import { ArrowUpRight, Check, ChevronDown, Minus, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product — PricePilot" }, { name: "robots", content: "noindex" }] };
    const url = `https://price-pilot-landing.lovable.app/product/${params.id}`;
    const img = `https://price-pilot-landing.lovable.app${p.img}`;
    const desc = `${p.brand} ${p.name} — live price comparison, AI verdict (${p.verdict}), 90-day price history and reviews across every major Indian store. Currently ₹${p.price.toLocaleString("en-IN")}.`;
    return {
      meta: [
        { title: `${p.name} — Price, Verdict & Comparison | PricePilot` },
        { name: "description", content: desc },
        { property: "og:title", content: `${p.name} — ${p.verdict} | PricePilot` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: img },
        { name: "twitter:image", content: img },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${p.brand} ${p.name}`,
            brand: { "@type": "Brand", name: p.brand },
            category: p.category,
            image: img,
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, bestRating: 5, ratingCount: 128 },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
      ],
    };
  },

  notFoundComponent: () => (
    <PageShell>
      <div className="pt-40 mx-auto max-w-[1400px] px-6 md:px-10 text-center">
        <div className="eyebrow">Product not found</div>
        <h1 className="mt-4 display text-5xl">This one slipped through.</h1>
        <Link to="/deals" className="mt-8 inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-ink text-background text-[13.5px]">
          Browse deals <ArrowUpRight size={14} />
        </Link>
      </div>
    </PageShell>
  ),
  component: ProductPage,
});

const STORES = [
  { name: "Amazon India", delta: 0, badge: "Best price" },
  { name: "Flipkart", delta: 800, badge: "" },
  { name: "Croma", delta: 1500, badge: "" },
  { name: "Vijay Sales", delta: 2100, badge: "" },
  { name: "Reliance Digital", delta: 2800, badge: "" },
  { name: "Apple Store", delta: 4900, badge: "Genuine" },
];

const PROS = ["Best-in-class battery, silent fanless", "Consistent long-term software updates", "Excellent build for the price"];
const CONS = ["Only two Thunderbolt ports", "Charger sold separately", "512GB base SSD feels tight"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [tab, setTab] = useState<"overview" | "specs" | "reviews">("overview");

  const alternatives = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const similar = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const history = Array.from({ length: 90 }, (_, i) => {
    const base = product.mrp;
    const v = base - Math.sin(i * 0.15) * 8000 - (i > 60 ? 12000 : 4000) - (i * 40);
    return Math.max(product.lowest - 200, Math.round(v));
  });

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 md:pt-32 pb-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[10%] top-[20%] h-[700px] w-[700px] rounded-full opacity-70" style={{ background: "radial-gradient(closest-side, oklch(0.965 0.025 65 / 0.9), transparent 72%)" }} />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <Reveal>
              <div className="relative aspect-square rounded-[36px] bg-surface-2 grain overflow-hidden grid place-items-center">
                <img src={product.img} alt={product.name} className="h-[75%] w-[75%] object-contain drop-shadow-[0_40px_60px_oklch(0.15_0.02_60/0.25)] anim-float-slow" />
              </div>
            </Reveal>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[product.img, product.img, product.img, product.img].map((src, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-surface-2 grid place-items-center overflow-hidden hover:ring-2 hover:ring-ink transition-all cursor-pointer">
                  <img src={src} alt="" className="h-[70%] w-[70%] object-contain opacity-80" />
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">{product.brand} · {product.category}</div>
            <h1 className="mt-3 display text-[10vw] md:text-[4.5rem] leading-[0.95] tracking-tight">{product.name}</h1>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center gap-1 text-[13px]"><Star size={14} className="fill-accent stroke-accent" /> <span className="font-semibold">{product.rating.toFixed(1)}</span> <span className="text-ink-muted">(6,247 reviews)</span></div>
              <span className="h-4 w-px bg-line" />
              <div className="text-[12px] text-ink-muted">6 stores tracked</div>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <div className="display text-6xl">{inr(product.price)}</div>
              <div className="text-[14px] text-ink-muted line-through">{inr(product.mrp)}</div>
              <div className="text-[13px] font-semibold text-[oklch(0.42_0.14_45)]">−{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</div>
            </div>
            <div className="mt-2 text-[12.5px] text-ink-muted">Lowest ever: {inr(product.lowest)} · Fair value: {inr(product.price + 3000)}</div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-1.5 h-12 px-6 rounded-full bg-ink text-background text-[14px] font-medium magnetic">Buy on Amazon <ArrowUpRight size={15} /></button>
              <button className="inline-flex items-center gap-1.5 h-12 px-6 rounded-full border border-line text-[14px] font-medium hover:border-ink transition-colors">Set price alert</button>
            </div>

            <div className="mt-8 rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted"><Sparkles size={11} className="text-accent" /> Buy now or wait?</div>
              <div className="mt-2 display text-2xl">{product.verdict === "Wait" ? "Wait 2–3 weeks." : "Buy now — great time."}</div>
              <p className="mt-2 text-[13px] text-ink-soft leading-relaxed">
                {product.verdict === "Wait"
                  ? "Historical pattern suggests a bigger drop as the next-gen launches. Confidence: 74%."
                  : "Currently at 90-day low with strong review sentiment. Confidence: 88%."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-12">
        <div className="flex items-center gap-1 border-b border-line">
          {(["overview", "specs", "reviews"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`relative px-4 py-3 text-[13px] font-medium capitalize transition-colors ${tab === t ? "text-ink" : "text-ink-muted hover:text-ink-soft"}`}>
              {t}
              <span className={`absolute inset-x-0 -bottom-px h-px bg-ink origin-left transition-transform duration-500 ${tab === t ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "overview" && (
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-7">
                <div className="eyebrow">AI Summary</div>
                <h3 className="mt-3 display text-3xl md:text-4xl leading-[1.05]">The one to buy if you value <span className="italic font-normal text-ink-soft">longevity over specs.</span></h3>
                <p className="mt-5 text-[15px] text-ink-soft leading-relaxed max-w-[52ch]">Across 4,300 verified reviews and eighteen professional benchmarks, this product consistently ranks in the top three of its category. It trades headline peak performance for silent, sustained real-world use — which is what most owners actually value after month two.</p>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="eyebrow mb-3">Pros</div>
                    <ul className="space-y-2 text-[13.5px]">{PROS.map((x) => <li key={x} className="flex gap-2"><Check size={14} className="mt-0.5 text-accent" />{x}</li>)}</ul>
                  </div>
                  <div>
                    <div className="eyebrow mb-3">Cons</div>
                    <ul className="space-y-2 text-[13.5px]">{CONS.map((x) => <li key={x} className="flex gap-2"><Minus size={14} className="mt-0.5 text-ink-muted" />{x}</li>)}</ul>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="eyebrow mb-3">90-day price history</div>
                <div className="rounded-3xl border border-line bg-surface p-6">
                  <PriceChart data={history} lowest={product.lowest} />
                  <div className="mt-3 flex items-center justify-between text-[11.5px] text-ink-muted">
                    <span>90 days ago</span>
                    <span>Lowest {inr(product.lowest)}</span>
                    <span>Today</span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="eyebrow mb-3">Store comparison</div>
                  <div className="rounded-3xl border border-line bg-surface overflow-hidden">
                    {STORES.map((s, i) => (
                      <div key={s.name} className={`flex items-center justify-between gap-3 px-5 py-4 ${i !== STORES.length - 1 ? "border-b border-line" : ""}`}>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate">{s.name}</div>
                          {s.badge && <div className="text-[10.5px] uppercase tracking-[0.14em] text-accent mt-0.5">{s.badge}</div>}
                        </div>
                        <div className="text-[13.5px] font-semibold display">{inr(product.price + s.delta)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === "specs" && (
            <div className="rounded-3xl border border-line overflow-hidden max-w-2xl">
              {[
                ["Brand", product.brand], ["Category", product.category], ["Price today", inr(product.price)],
                ["MRP", inr(product.mrp)], ["Lowest ever", inr(product.lowest)], ["Rating", `${product.rating.toFixed(1)} / 5`],
                ["Warranty", "1 year"], ["Ships in", "2 days"],
              ].map(([k, v], i) => (
                <div key={k} className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-surface" : "bg-surface-2/60"}`}>
                  <div className="px-6 py-4 text-[12px] uppercase tracking-[0.14em] text-ink-muted">{k}</div>
                  <div className="px-6 py-4 text-[14px] text-ink">{v}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "reviews" && (
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <div className="display text-6xl leading-none">{product.rating.toFixed(1)}</div>
                <div className="mt-2 flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < Math.round(product.rating) ? "fill-accent stroke-accent" : "stroke-ink-muted"} />)}</div>
                <div className="mt-2 text-[13px] text-ink-muted">6,247 verified reviews across 4 stores</div>
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((n, i) => (
                    <div key={n} className="flex items-center gap-3 text-[12px]">
                      <span className="w-4 text-ink-muted">{n}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden"><div className="h-full bg-ink" style={{ width: `${[72, 20, 5, 2, 1][i]}%` }} /></div>
                      <span className="w-8 text-right text-ink-muted">{[72, 20, 5, 2, 1][i]}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-8 space-y-6">
                {[
                  { name: "Aarav", text: "Two months in. Battery is genuinely all-day. The keyboard is quieter than I expected.", rating: 5 },
                  { name: "Sana", text: "Feels premium out of the box. Wish the base SSD was 1TB but the M-series speed helps.", rating: 4 },
                  { name: "Rahul", text: "Perfect for coding. Docker runs cool. Zoom for hours without a fan spike.", rating: 5 },
                ].map((r) => (
                  <div key={r.name} className="p-6 rounded-2xl border border-line">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-semibold">{r.name}</div>
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "fill-accent stroke-accent" : "stroke-ink-muted"} />)}</div>
                    </div>
                    <p className="mt-2 text-[14px] text-ink-soft leading-relaxed">{r.text}</p>
                  </div>
                ))}
                <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-ink">Load more <ChevronDown size={14} /></button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Alternatives */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-32">
        <div className="eyebrow mb-3">Alternatives in {product.category}</div>
        <h3 className="display text-3xl md:text-4xl">Or consider one of these.</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {alternatives.map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group block rounded-3xl border border-line bg-surface overflow-hidden hover:border-ink/40 transition-all">
              <div className="aspect-[5/4] bg-surface-2 grid place-items-center overflow-hidden"><img src={p.img} alt="" className="h-[70%] w-[70%] object-contain transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="p-5">
                <div className="text-[11px] text-ink-muted">{p.brand}</div>
                <div className="text-[15px] font-semibold">{p.name}</div>
                <div className="mt-2 display text-lg">{inr(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Similar */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24">
        <div className="eyebrow mb-3">People also viewed</div>
        <div className="grid gap-4 md:grid-cols-4">
          {similar.map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group flex items-center gap-3 p-3 rounded-2xl border border-line hover:border-ink/40 hover:bg-surface-2 transition-all">
              <img src={p.img} alt="" className="h-14 w-14 rounded-xl object-cover bg-surface-2" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-ink-muted">{p.category}</div>
                <div className="text-[13px] font-semibold truncate">{p.name}</div>
                <div className="text-[12px] text-ink-muted">{inr(p.price)}</div>
              </div>
              <ArrowUpRight size={14} className="text-ink-muted group-hover:text-ink" />
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function PriceChart({ data, lowest }: { data: number[]; lowest: number }) {
  const w = 420, h = 160;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = (v: number) => ((v - min) / (max - min + 0.0001));
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - norm(v) * h * 0.9 - 10}`).join(" ");
  const lowY = h - norm(lowest) * h * 0.9 - 10;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[160px]">
      <defs>
        <linearGradient id="chartfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.17 45)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="oklch(0.68 0.17 45)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1={lowY} x2={w} y2={lowY} stroke="oklch(0.9 0.006 75)" strokeDasharray="4 4" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#chartfill)" />
      <polyline points={pts} fill="none" stroke="oklch(0.16 0.01 70)" strokeWidth={1.75} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400} style={{ animation: "sparkline-draw 2s ease-out forwards" }} />
    </svg>
  );
}
