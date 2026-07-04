import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, EditorialHero, Reveal } from "@/components/site/PageShell";
import { PRODUCTS, inr } from "@/lib/mock";
import { ArrowUpRight, Bell, Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — PricePilot" },
      { name: "description", content: "Your saved products. Live current vs lowest price, AI recommendations and one-tap notify-me alerts." },
      { property: "og:title", content: "Wishlist — PricePilot" },
      { property: "og:description", content: "Track everything you're thinking about buying — with AI in your corner." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const items = PRODUCTS.slice(0, 6);
  return (
    <PageShell>
      <EditorialHero
        kicker="Wishlist"
        title={<>Things you're <br /><span className="italic font-normal text-ink-soft">watching.</span></>}
        lede="Every product you saved, tracked in real time across every store. We'll tell you when the moment is right."
      />

      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const dropPct = Math.max(0, Math.round(((p.mrp - p.price) / p.mrp) * 100));
            const isLow = p.price <= p.lowest;
            return (
              <Reveal key={p.id} delay={i * 60}>
                <div className="group flex flex-col rounded-3xl border border-line bg-surface overflow-hidden hover:border-ink/40 transition-all">
                  <Link to="/product/$id" params={{ id: p.id }} className="relative aspect-[5/4] bg-surface-2 grid place-items-center overflow-hidden">
                    <img src={p.img} alt={p.name} className="h-[70%] w-[70%] object-contain transition-transform duration-[1000ms] group-hover:scale-[1.05]" />
                    <button aria-label="Remove" className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/95 border border-line text-accent">
                      <Heart size={14} className="fill-accent stroke-accent" />
                    </button>
                    {isLow && <span className="absolute top-3 left-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] px-2 py-1 rounded-full bg-ink text-background">Lowest ever</span>}
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[11px] text-ink-muted">{p.brand}</div>
                    <Link to="/product/$id" params={{ id: p.id }} className="mt-1 display text-2xl leading-tight">{p.name}</Link>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-surface-2">
                        <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">Current</div>
                        <div className="mt-1 display text-lg">{inr(p.price)}</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-surface-2">
                        <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">Lowest</div>
                        <div className="mt-1 display text-lg">{inr(p.lowest)}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-muted">
                      <Sparkles size={12} className="text-accent" />
                      AI: {p.verdict === "Wait" ? "Wait — better price likely soon." : "Great time to buy."}
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Link to="/product/$id" params={{ id: p.id }} className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-ink text-background text-[13px] font-medium">
                        View <ArrowUpRight size={13} />
                      </Link>
                      <button className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-line hover:border-ink text-[13px] font-medium transition-colors">
                        <Bell size={13} /> Notify
                      </button>
                    </div>

                    {dropPct > 0 && <div className="mt-3 text-[11px] text-ink-muted">−{dropPct}% vs MRP</div>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
