import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, EditorialHero, Reveal } from "@/components/site/PageShell";
import { PRODUCTS, inr, type Product } from "@/lib/mock";
import { ArrowUpRight, Check, Minus, Plus, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare — PricePilot" },
      { name: "description", content: "Compare products like never before. Specs, radar charts, AI verdict, pros vs cons and store-by-store price comparison." },
      { property: "og:title", content: "Compare — PricePilot" },
      { property: "og:description", content: "Compare products across specs, price, reviews and AI verdict — instantly." },
    ],
  }),
  component: ComparePage,
});

const AXES = ["Performance", "Battery", "Design", "Camera", "Value", "Software"];
function scoreFor(p: Product): number[] {
  // deterministic pseudo scores from name
  const seed = [...p.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AXES.map((_, i) => {
    const v = Math.sin(seed * (i + 3) * 0.31) * 0.5 + 0.5;
    return 60 + Math.round(v * 40);
  });
}

function ComparePage() {
  const [selected, setSelected] = useState<Product[]>([PRODUCTS[0], PRODUCTS[2]]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const add = (p: Product) => {
    if (selected.find((s) => s.id === p.id) || selected.length >= 4) return;
    setSelected([...selected, p]);
    setPickerOpen(false);
  };
  const remove = (id: string) => setSelected(selected.filter((s) => s.id !== id));

  return (
    <PageShell>
      <EditorialHero
        kicker="Compare · Side-by-side"
        title={<>Compare products <br /><span className="italic font-normal text-ink-soft">like never before.</span></>}
        lede="Two, three, or four products. Specs, radar charts, real review intelligence, and one clear AI verdict on which one is right for you."
      />

      {/* Slots */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => {
            const p = selected[i];
            if (!p) {
              return (
                <button
                  key={i}
                  onClick={() => setPickerOpen(true)}
                  className="group flex flex-col items-center justify-center gap-3 aspect-[3/4] rounded-3xl border border-dashed border-line hover:border-ink/60 hover:bg-surface-2 transition-all"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-2 border border-line group-hover:bg-ink group-hover:text-background transition-colors"><Plus size={18} /></span>
                  <span className="text-[13px] font-medium text-ink-soft">Add product</span>
                </button>
              );
            }
            return (
              <div key={p.id} className="relative flex flex-col aspect-[3/4] rounded-3xl border border-line bg-surface overflow-hidden">
                <button onClick={() => remove(p.id)} className="absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/90 border border-line hover:bg-ink hover:text-background transition-colors">
                  <X size={14} />
                </button>
                <div className="flex-1 grid place-items-center bg-surface-2 overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-[70%] w-[70%] object-contain" />
                </div>
                <div className="p-4">
                  <div className="text-[11px] text-ink-muted">{p.brand}</div>
                  <div className="text-[14px] font-semibold text-ink truncate">{p.name}</div>
                  <div className="mt-1 display text-[16px]">{inr(p.price)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radar */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <div className="eyebrow">Performance profile</div>
              <h2 className="display text-4xl md:text-5xl mt-3">Where each one shines.</h2>
              <p className="mt-5 text-[15px] text-ink-soft leading-relaxed max-w-[48ch]">Every product profiled across six dimensions using verified benchmark aggregates, review sentiment and long-term ownership signals.</p>
              <ul className="mt-6 space-y-2 text-[13px]">
                {selected.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ background: LEGEND[i % LEGEND.length] }} />
                    <span className="text-ink font-medium">{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-square rounded-[36px] bg-surface border border-line p-6 grain">
              <Radar products={selected} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Spec table */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24">
        <div className="eyebrow mb-4">Specifications</div>
        <div className="rounded-3xl border border-line overflow-hidden">
          {SPEC_ROWS.map((row, ri) => (
            <div key={row.label} className={`grid ${gridCols(selected.length)} ${ri % 2 === 1 ? "bg-surface-2/60" : "bg-surface"}`}>
              <div className="px-6 py-5 text-[12px] uppercase tracking-[0.14em] text-ink-muted border-r border-line">{row.label}</div>
              {selected.map((p) => (
                <div key={p.id} className="px-6 py-5 text-[14px] text-ink border-r border-line last:border-r-0">{row.value(p)}</div>
              ))}
              {Array.from({ length: 4 - selected.length }).map((_, i) => (
                <div key={i} className="px-6 py-5 border-r border-line last:border-r-0" />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24">
        <div className="rounded-[36px] bg-ink text-background p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full opacity-30" style={{ background: "radial-gradient(closest-side, oklch(0.68 0.17 45 / 0.7), transparent 70%)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-background/60"><Sparkles size={12} /> AI Verdict</div>
            <h3 className="mt-4 display text-4xl md:text-6xl leading-[1.02]">
              {selected[0]?.name ?? "Pick one"} <span className="italic font-normal text-background/60">is the smarter pick right now.</span>
            </h3>
            <p className="mt-5 text-[15px] max-w-[62ch] text-background/70 leading-relaxed">Based on current pricing, review sentiment across 6,200+ verified sources, and a two-year value projection — it wins on total cost of ownership and long-term software support.</p>
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-background/50 mb-3">Pros</div>
                <ul className="space-y-2 text-[13.5px]">
                  {["Best-in-class battery life", "Consistent long-term software updates", "Strong resale value"].map((x) => (
                    <li key={x} className="flex gap-2"><Check size={14} className="mt-0.5 text-accent" />{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-background/50 mb-3">Cons</div>
                <ul className="space-y-2 text-[13.5px]">
                  {["Premium over rivals", "Charger sold separately", "Limited port selection"].map((x) => (
                    <li key={x} className="flex gap-2"><Minus size={14} className="mt-0.5 text-background/50" />{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best for */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24">
        <div className="eyebrow mb-3">Best for</div>
        <h2 className="display text-4xl md:text-5xl">Choose by the life you live.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {["Students", "Gaming", "Programming", "Creators", "Professionals"].map((tag, i) => (
            <div key={tag} className="p-6 rounded-2xl border border-line hover:border-ink/50 hover:-translate-y-1 transition-all">
              <div className="text-[11px] text-ink-muted">Recommended</div>
              <div className="mt-2 display text-2xl">{tag}</div>
              <div className="mt-4 text-[13px] text-ink font-semibold">{selected[i % selected.length]?.name ?? "—"}</div>
              <Link to="/deals" className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium link-underline">See picks <ArrowUpRight size={12} /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* Picker overlay */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4" onClick={() => setPickerOpen(false)}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-2xl" />
          <div className="relative w-full max-w-2xl rounded-3xl bg-background border border-line p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow">Add a product</div>
              <button onClick={() => setPickerOpen(false)}><X size={16} /></button>
            </div>
            <div className="grid gap-2">
              {PRODUCTS.filter((p) => !selected.find((s) => s.id === p.id)).map((p) => (
                <button key={p.id} onClick={() => add(p)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-2 transition-colors text-left">
                  <img src={p.img} alt="" className="h-14 w-14 rounded-xl object-cover bg-surface-2" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-ink-muted">{p.category}</div>
                    <div className="text-[14px] font-semibold truncate">{p.name}</div>
                  </div>
                  <div className="text-[13px] font-semibold">{inr(p.price)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

const LEGEND = ["oklch(0.68 0.17 45)", "oklch(0.55 0.12 250)", "oklch(0.6 0.14 160)", "oklch(0.5 0.15 320)"];

const SPEC_ROWS: { label: string; value: (p: Product) => string }[] = [
  { label: "Brand", value: (p) => p.brand },
  { label: "Category", value: (p) => p.category },
  { label: "Price today", value: (p) => inr(p.price) },
  { label: "MRP", value: (p) => inr(p.mrp) },
  { label: "Lowest ever", value: (p) => inr(p.lowest) },
  { label: "Rating", value: (p) => `${p.rating.toFixed(1)} / 5` },
  { label: "AI verdict", value: (p) => p.verdict },
  { label: "Warranty", value: () => "1 year" },
];

function gridCols(n: number) {
  return { 1: "grid-cols-[240px_1fr]", 2: "grid-cols-[240px_1fr_1fr]", 3: "grid-cols-[240px_1fr_1fr_1fr]", 4: "grid-cols-[240px_1fr_1fr_1fr_1fr]" }[n as 1 | 2 | 3 | 4];
}

function Radar({ products }: { products: Product[] }) {
  const size = 400;
  const cx = size / 2, cy = size / 2;
  const R = size * 0.38;
  const N = AXES.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const point = (i: number, v: number) => [cx + Math.cos(angle(i)) * R * (v / 100), cy + Math.sin(angle(i)) * R * (v / 100)];

  const rings = [0.25, 0.5, 0.75, 1];
  const scores = useMemo(() => products.map(scoreFor), [products]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      {rings.map((r) => (
        <polygon key={r} points={Array.from({ length: N }, (_, i) => `${cx + Math.cos(angle(i)) * R * r},${cy + Math.sin(angle(i)) * R * r}`).join(" ")} fill="none" stroke="oklch(0.9 0.006 75)" strokeWidth={1} />
      ))}
      {Array.from({ length: N }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle(i)) * R} y2={cy + Math.sin(angle(i)) * R} stroke="oklch(0.9 0.006 75)" strokeWidth={1} />
      ))}
      {scores.map((s, pi) => {
        const pts = s.map((v, i) => point(i, v));
        return (
          <g key={pi}>
            <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={LEGEND[pi % LEGEND.length]} fillOpacity={0.15} stroke={LEGEND[pi % LEGEND.length]} strokeWidth={1.5} style={{ animation: `reveal-up 0.9s ease-out both`, animationDelay: `${pi * 120}ms` }} />
            {pts.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={3} fill={LEGEND[pi % LEGEND.length]} />))}
          </g>
        );
      })}
      {AXES.map((a, i) => {
        const [x, y] = [cx + Math.cos(angle(i)) * (R + 22), cy + Math.sin(angle(i)) * (R + 22)];
        return (
          <text key={a} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="oklch(0.35 0.01 70)" fontFamily="Inter Tight">{a}</text>
        );
      })}
    </svg>
  );
}
