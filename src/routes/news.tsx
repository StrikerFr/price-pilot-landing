import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, EditorialHero, Reveal } from "@/components/site/PageShell";
import { IMG, PRODUCTS } from "@/lib/mock";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — PricePilot" },
      { name: "description", content: "The shopping desk. Editorial coverage of launches, drops, rumors and buying intelligence — written by humans, sharpened by AI." },
      { property: "og:title", content: "News — PricePilot" },
      { property: "og:description", content: "Launches, drops and buying intelligence — editorial coverage from the PricePilot desk." },
    ],
  }),
  component: NewsPage,
});

const FEATURED = {
  kicker: "The long read",
  title: "The end of the flagship arms race",
  dek: "For the first time in a decade, the phones people actually want cost less than ₹65,000. Here's what changed — and what it means for the way you shop.",
  author: "Meera Iyer",
  date: "July 3, 2026",
  img: IMG.heroPhone,
};

const ARTICLES = [
  { kicker: "Launched", title: "Nothing Phone (3) breaks cover with a dual-screen back", excerpt: "Transparent, angular, and unexpectedly sensible. First hands-on impressions.", img: IMG.catPhones, when: "2h" },
  { kicker: "Deal alert", title: "Sony WH-1000XM6 hits lowest ever at ₹24,990", excerpt: "Down from ₹36,990. Available at three stores. Our AI says buy.", img: IMG.dealEarbuds, when: "5h" },
  { kicker: "Report", title: "Amazon's Big Billion Days set for October 4", excerpt: "Six categories to watch, three to avoid. The strategy for buying well.", img: IMG.saleBBD, when: "Yesterday" },
  { kicker: "Rumor", title: "MacBook Pro M6 tipped for a redesigned chassis", excerpt: "Thinner, lighter, and — if leaks hold — the first with a matte glass lid.", img: IMG.heroLaptop, when: "2d" },
  { kicker: "Guide", title: "The five monitors you should actually consider in 2026", excerpt: "We tested twenty-three. Only five are worth your money.", img: IMG.catMonitors, when: "3d" },
  { kicker: "Explainer", title: "What 'lowest-ever' actually means (and when it lies)", excerpt: "Behind the badge every price tracker uses — and the trap most miss.", img: IMG.catAudio, when: "4d" },
];

const UPCOMING = [
  { name: "iPad Pro M5", when: "Late July", tag: "Confirmed" },
  { name: "Google Pixel 11", when: "August 14", tag: "Rumor" },
  { name: "Samsung Galaxy Z Fold 8", when: "September", tag: "Confirmed" },
  { name: "Sony PS5 Slim v2", when: "Q4", tag: "Rumor" },
];

function NewsPage() {
  return (
    <PageShell>
      <EditorialHero
        kicker="News · The Shopping Desk"
        title={<>The desk.</>}
        lede="An editorial view of the products, prices and moves shaping how the world shops. Curated daily. Never a slideshow."
      />

      {/* Featured */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <Link to="/news" className="group grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7 relative aspect-[4/3] rounded-3xl overflow-hidden bg-surface-2">
              <img src={FEATURED.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
            </div>
            <div className="md:col-span-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{FEATURED.kicker}</div>
              <h2 className="mt-4 display text-4xl md:text-6xl leading-[1.02] text-balance">{FEATURED.title}</h2>
              <p className="mt-5 text-[15.5px] text-ink-soft leading-relaxed max-w-[46ch]">{FEATURED.dek}</p>
              <div className="mt-6 flex items-center gap-3 text-[12px] text-ink-muted">
                <span>{FEATURED.author}</span>
                <span className="h-1 w-1 rounded-full bg-line" />
                <span>{FEATURED.date}</span>
                <span className="h-1 w-1 rounded-full bg-line" />
                <span>7 min read</span>
              </div>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Editorial grid */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24">
        <div className="flex items-end justify-between mb-8">
          <h3 className="display text-3xl md:text-4xl">Latest</h3>
          <div className="text-[12px] text-ink-muted">Updated 4 minutes ago</div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.title} delay={i * 60}>
              <Link to="/news" className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-2 mb-5">
                  <img src={a.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
                </div>
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-accent">{a.kicker}</div>
                <h4 className="mt-2 display text-2xl leading-[1.1] group-hover:text-ink transition-colors">{a.title}</h4>
                <p className="mt-3 text-[13.5px] text-ink-muted leading-relaxed">{a.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[11.5px] text-ink-muted">
                  <Sparkles size={11} className="text-accent" /> AI summary in 2 lines · {a.when} ago
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Upcoming releases + trending */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-32 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-7">
          <div className="eyebrow mb-4">Upcoming releases</div>
          <div className="rounded-3xl border border-line bg-surface overflow-hidden">
            {UPCOMING.map((u, i) => (
              <div key={u.name} className={`flex items-center justify-between gap-4 px-6 py-5 ${i !== UPCOMING.length - 1 ? "border-b border-line" : ""}`}>
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted">{u.tag}</div>
                  <div className="mt-1 display text-xl">{u.name}</div>
                </div>
                <div className="text-[13px] font-medium text-ink-soft whitespace-nowrap">{u.when}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="eyebrow mb-4">Trending products</div>
          <div className="space-y-3">
            {PRODUCTS.slice(0, 5).map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group flex items-center gap-4 p-3 rounded-2xl border border-line hover:border-ink/40 hover:bg-surface-2 transition-all">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-surface-2"><img src={p.img} alt="" className="h-full w-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{p.name}</div>
                  <div className="text-[11px] text-ink-muted">{p.category}</div>
                </div>
                <ArrowUpRight size={14} className="text-ink-muted group-hover:text-ink" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
