import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, EditorialHero, Reveal } from "@/components/site/PageShell";
import { PRODUCTS, inr } from "@/lib/mock";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/price-drops")({
  head: () => ({
    meta: [
      { title: "Price Drops — PricePilot" },
      { name: "description", content: "Today's biggest price drops. Live tracker, animated history, lowest-ever badges and AI verdicts on whether each drop is actually worth buying." },
      { property: "og:title", content: "Price Drops — PricePilot" },
      { property: "og:description", content: "Live price drops, tracked across every major store. AI tells you if it's actually worth buying." },
    ],
  }),
  component: PriceDropsPage,
});

const FILTERS = ["Today", "This Week", "This Month", "All time"] as const;
const CATS = ["All", "Laptops", "Smartphones", "Audio", "Monitors", "Gaming", "Cameras"];

// deterministic random history
function history(seed: number) {
  const arr: number[] = [];
  let v = 60 + (seed % 40);
  for (let i = 0; i < 40; i++) {
    v += Math.sin((i + seed) * 0.35) * 3 + (Math.sin(seed * 1.7) * 0.5);
    arr.push(Math.max(20, Math.min(100, v)));
  }
  arr[arr.length - 1] = Math.min(...arr) + 2;
  return arr;
}

function PriceDropsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Today");
  const [cat, setCat] = useState("All");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2400);
    return () => clearInterval(t);
  }, []);

  const filtered = PRODUCTS.filter((p) => cat === "All" || p.category === cat);

  return (
    <PageShell>
      <EditorialHero
        kicker="Price Drops · Live"
        title={<>Today's biggest <br /><span className="italic font-normal text-ink-soft">price stories.</span></>}
        lede="A living record of every meaningful price movement. We track thousands of products every 15 minutes — and only surface the drops that matter."
        right={
          <div className="rounded-3xl border border-line bg-surface p-6 grain">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span> Live tracker</div>
            <div className="mt-4 space-y-2">
              {PRODUCTS.slice((tick) % 4, ((tick) % 4) + 3).concat(PRODUCTS).slice(0, 3).map((p) => (
                <div key={p.id + tick} className="flex items-center justify-between gap-3 text-[13px] anim-reveal">
                  <span className="truncate">{p.name}</span>
                  <span className="text-accent font-semibold whitespace-nowrap">−{Math.round(((p.mrp - p.price) / p.mrp) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Filters */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 sticky top-16 z-30 py-4 bg-background/85 backdrop-blur-xl border-y border-line">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-all ${filter === f ? "bg-ink text-background border-ink" : "border-line hover:border-ink"}`}>{f}</button>
          ))}
          <div className="mx-3 h-5 w-px bg-line" />
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-[12px] border transition-all ${cat === c ? "bg-surface-3 border-ink/40 text-ink" : "border-line text-ink-soft hover:text-ink"}`}>{c}</button>
          ))}
        </div>
      </section>

      {/* Drops list */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-12 space-y-5">
        {filtered.map((p, i) => {
          const drop = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          const isLow = p.price <= p.lowest;
          const hist = history(i + 3);
          return (
            <Reveal key={p.id} delay={i * 50}>
              <Link to="/product/$id" params={{ id: p.id }} className="group grid grid-cols-12 gap-6 items-center p-6 md:p-8 rounded-3xl border border-line bg-surface hover:border-ink/40 hover:bg-surface-2 transition-all">
                <div className="col-span-12 md:col-span-2">
                  <div className="h-24 w-24 rounded-2xl bg-surface-2 overflow-hidden">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="text-[11px] text-ink-muted">{p.brand} · {p.category}</div>
                  <div className="mt-1 display text-2xl">{p.name}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {isLow && <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-accent/15 text-[oklch(0.42_0.14_45)]">Lowest ever</span>}
                    <span className="text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">Available at 6 stores</span>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <div className="text-[11px] text-ink-muted">Now</div>
                  <div className="display text-3xl mt-1">{inr(p.price)}</div>
                  <div className="text-[12px] text-ink-muted line-through">{inr(p.mrp)}</div>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <div className="text-[11px] text-ink-muted mb-1.5">30-day trend</div>
                  <Sparkline data={hist} />
                  <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[oklch(0.42_0.14_45)]">
                    <ArrowDownRight size={13} /> −{drop}%
                  </div>
                </div>
                <div className="col-span-12 md:col-span-2 flex md:justify-end">
                  <div className="rounded-2xl border border-line bg-background p-3 w-full md:w-auto md:max-w-[220px]">
                    <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-ink-muted"><Sparkles size={11} /> AI Verdict</div>
                    <div className="mt-1 text-[13px] font-semibold text-ink">{p.verdict}</div>
                    <div className="mt-1 text-[11.5px] text-ink-muted leading-snug">{verdictReason(p.verdict)}</div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-32 mb-8">
        <div className="rounded-3xl border border-line bg-surface p-10 grid md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="eyebrow">Never miss a drop</div>
            <h3 className="display text-3xl md:text-4xl mt-3">We watch prices so you don't have to.</h3>
            <p className="mt-3 text-[14px] text-ink-muted max-w-[52ch]">Set a target price on any product. We'll email you the moment it drops — with the AI's take on whether it's really worth buying.</p>
          </div>
          <Link to="/profile" className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-ink text-background text-[13.5px] font-medium magnetic">
            Set an alert <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function verdictReason(v: string) {
  if (v === "Buy now") return "Below fair value, strong reviews.";
  if (v === "Wait") return "Bigger drops likely within 3 weeks.";
  return "Rare price. Won't stay long.";
}

function Sparkline({ data }: { data: number[] }) {
  const w = 160, h = 42;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = (v: number) => ((v - min) / (max - min + 0.0001));
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - norm(v) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[42px]">
      <defs>
        <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.17 45)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="oklch(0.68 0.17 45)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#sparkfill)" />
      <polyline points={pts} fill="none" stroke="oklch(0.68 0.17 45)" strokeWidth={1.5} strokeLinecap="round" strokeDasharray={500} strokeDashoffset={500} style={{ animation: "sparkline-draw 1.6s ease-out forwards" }} />
    </svg>
  );
}
