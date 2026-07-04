import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell, EditorialHero, Reveal } from "@/components/site/PageShell";
import { IMG } from "@/lib/mock";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";

export const Route = createFileRoute("/sales-calendar")({
  head: () => ({
    meta: [
      { title: "Sales Calendar — PricePilot" },
      { name: "description", content: "The year in sales — an interactive timeline of every major shopping event, with countdowns, expected discounts and the products most likely to drop." },
      { property: "og:title", content: "Sales Calendar — PricePilot" },
      { property: "og:description", content: "An interactive timeline of every major shopping event, with AI insight on what to buy and when." },
    ],
  }),
  component: SalesCalendarPage,
});

const EVENTS = [
  { name: "Big Billion Days", when: "Oct 4 – Oct 12", img: IMG.saleBBD, expected: "45–70%", note: "Flipkart's biggest event of the year.", drops: ["Phones", "TVs", "Laptops"], date: new Date("2026-10-04") },
  { name: "Great Indian Festival", when: "Oct 3 – Oct 15", img: IMG.saleGIF, expected: "40–65%", note: "Amazon India's flagship sale.", drops: ["Headphones", "Watches", "Kitchen"], date: new Date("2026-10-03") },
  { name: "Diwali Sale", when: "Oct 20 – Nov 1", img: IMG.saleBBD, expected: "35–55%", note: "Every store joins. Best time for appliances.", drops: ["Appliances", "TVs", "Beauty"], date: new Date("2026-10-20") },
  { name: "Black Friday", when: "Nov 28", img: IMG.saleBF, expected: "30–60%", note: "Global drops. Best for import electronics.", drops: ["Cameras", "Audio", "Wearables"], date: new Date("2026-11-28") },
  { name: "Cyber Monday", when: "Dec 1", img: IMG.saleBF, expected: "25–50%", note: "Software, subscriptions and peripherals.", drops: ["Software", "SSDs", "Peripherals"], date: new Date("2026-12-01") },
  { name: "Year End Sale", when: "Dec 26 – Dec 31", img: IMG.salePrime, expected: "30–55%", note: "Clearance across categories.", drops: ["Laptops", "Fashion", "Home"], date: new Date("2026-12-26") },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function SalesCalendarPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.75 - r.top) / (r.height * 0.9)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PageShell>
      <EditorialHero
        kicker="Sales Calendar · 2026"
        title={<>The year, <br /><span className="italic font-normal text-ink-soft">in sales.</span></>}
        lede="Every major shopping event, mapped and tracked. Countdown timers, expected discounts and the products most likely to drop — so you buy at exactly the right moment."
      />

      {/* Horizontal ticker of dates */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          {EVENTS.map((e) => (
            <div key={e.name} className="flex-shrink-0 flex items-center gap-3 px-4 h-11 rounded-full border border-line bg-surface text-[12.5px]">
              <CalendarDays size={13} className="text-ink-muted" />
              <span className="font-semibold text-ink">{e.name}</span>
              <span className="text-ink-muted">{e.when}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vertical draw-in timeline */}
      <section ref={trackRef} className="relative mx-auto max-w-[1400px] px-6 md:px-10 mt-20 pb-20">
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-line hidden md:block" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px bg-ink hidden md:block transition-all duration-100" style={{ height: `${progress * 100}%` }} />

        <div className="space-y-24 md:space-y-32">
          {EVENTS.map((e, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={e.name}>
                <div className={`grid md:grid-cols-2 gap-10 items-center ${flip ? "md:[direction:rtl]" : ""}`}>
                  <div className="md:[direction:ltr]">
                    <div className="relative aspect-[5/4] rounded-3xl overflow-hidden bg-surface-2">
                      <img src={e.img} alt={e.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.05]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                      <div className="absolute bottom-5 left-5 text-background">
                        <div className="text-[11px] uppercase tracking-[0.16em] opacity-70">{e.when}</div>
                        <div className="display text-3xl mt-1">{e.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="md:[direction:ltr]">
                    <Countdown target={e.date} />
                    <h3 className="mt-6 display text-4xl md:text-5xl leading-[1.02]">{e.name}</h3>
                    <p className="mt-4 text-[15px] text-ink-soft leading-relaxed max-w-[46ch]">{e.note}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
                      <div className="p-4 rounded-2xl border border-line">
                        <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted">Expected discount</div>
                        <div className="mt-1 display text-2xl">{e.expected}</div>
                      </div>
                      <div className="p-4 rounded-2xl border border-line">
                        <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted">Categories to watch</div>
                        <div className="mt-1 text-[13px] font-medium text-ink">{e.drops.join(" · ")}</div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[12.5px] text-ink-muted"><Sparkles size={12} className="text-accent" /> AI: Best window is the first 48 hours — inventory disappears fast.</div>
                    <Link to="/deals" className="mt-6 inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-line hover:border-ink text-[13px] font-medium">
                      Preview deals <ArrowUpRight size={13} />
                    </Link>
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

function Countdown({ target }: { target: Date }) {
  const { d, h, m, s } = useCountdown(target);
  const parts = [
    { l: "Days", v: d },
    { l: "Hours", v: h },
    { l: "Min", v: m },
    { l: "Sec", v: s },
  ];
  return (
    <div className="inline-flex items-center gap-3 p-2 pl-4 rounded-full border border-line bg-surface">
      <div className="eyebrow">Starts in</div>
      <div className="flex items-center gap-2">
        {parts.map((p) => (
          <div key={p.l} className="text-center min-w-[46px] px-2 py-1 rounded-full bg-ink text-background">
            <div className="display text-sm leading-none tabular-nums">{String(p.v).padStart(2, "0")}</div>
            <div className="text-[8.5px] uppercase tracking-[0.14em] opacity-60 mt-0.5">{p.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
