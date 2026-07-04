import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, EditorialHero, Reveal } from "@/components/site/PageShell";
import { IMG, PRODUCTS, inr } from "@/lib/mock";
import { ArrowUpRight, Cpu, Smartphone, Headphones, Keyboard, Monitor, Gamepad2, Camera, Watch, Home } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — PricePilot" },
      { name: "description", content: "Every category, carefully curated. Editorial shortlists across laptops, phones, audio, monitors, gaming and more." },
      { property: "og:title", content: "Categories — PricePilot" },
      { property: "og:description", content: "Editorial shortlists across every major category, updated hourly." },
    ],
  }),
  component: CategoriesPage,
});

const CATS = [
  { icon: Cpu, name: "Laptops", img: IMG.catLaptops, count: "1,240", tagline: "From ultrabooks to workstations." },
  { icon: Smartphone, name: "Smartphones", img: IMG.catPhones, count: "980", tagline: "Flagships, value picks, foldables." },
  { icon: Headphones, name: "Audio", img: IMG.catAudio, count: "1,540", tagline: "Cans, IEMs, wireless earbuds." },
  { icon: Keyboard, name: "Keyboards", img: IMG.dealKeyboard, count: "420", tagline: "Mechanical, low-profile, TKL." },
  { icon: Monitor, name: "Monitors", img: IMG.catMonitors, count: "510", tagline: "OLED, ultrawide, 4K." },
  { icon: Gamepad2, name: "Gaming", img: IMG.catGaming, count: "720", tagline: "Consoles, GPUs, handhelds." },
  { icon: Camera, name: "Cameras", img: IMG.dealCamera, count: "380", tagline: "Mirrorless, action, cinema." },
  { icon: Watch, name: "Smartwatches", img: IMG.dealWatch, count: "640", tagline: "Fitness, health, dressy." },
  { icon: Home, name: "Smart Home", img: IMG.catAccessories, count: "3,120", tagline: "Lights, hubs, security, robots." },
];

const USE_CASES = [
  { title: "For students", desc: "Long battery, light chassis, honest value.", n: "142 picks" },
  { title: "For creators", desc: "Colour-accurate screens, silent fans, fast SSDs.", n: "98 picks" },
  { title: "For gamers", desc: "High refresh, cool thermals, headroom for tomorrow.", n: "76 picks" },
  { title: "For minimalists", desc: "One thing, done exceptionally well.", n: "54 picks" },
];

function CategoriesPage() {
  return (
    <PageShell>
      <EditorialHero
        kicker="Categories · Curated"
        title={<>Every category,<br /><span className="italic font-normal text-ink-soft">carefully curated.</span></>}
        lede="Nine categories. Thousands of products. A single, quiet editorial eye — we surface only what's worth your time."
      />

      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <Link
                to="/deals"
                className="group relative block overflow-hidden rounded-3xl border border-line bg-surface hover:border-ink/40 transition-all duration-500"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-background/90 text-ink">
                    {c.count} products
                  </span>
                  <div className="absolute top-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-ink">
                    <c.icon size={17} strokeWidth={1.7} />
                  </div>
                </div>
                <div className="p-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display text-2xl leading-none">{c.name}</h3>
                    <p className="mt-2 text-[13px] text-ink-muted">{c.tagline}</p>
                  </div>
                  <ArrowUpRight size={18} className="text-ink-muted group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-32">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow">Shop by use case</div>
            <h2 className="display text-4xl md:text-6xl mt-3">Not what — <span className="italic font-normal text-ink-soft">why.</span></h2>
          </div>
          <Link to="/ai-assistant" className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-medium link-underline">Ask the AI <ArrowUpRight size={13} /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.title} delay={i * 80}>
              <div className="group h-full p-7 rounded-3xl border border-line bg-surface hover:bg-surface-2 transition-colors">
                <div className="eyebrow">{u.n}</div>
                <h3 className="display text-2xl mt-3">{u.title}</h3>
                <p className="mt-3 text-[13.5px] text-ink-muted leading-relaxed">{u.desc}</p>
                <div className="mt-8 inline-flex items-center gap-1.5 text-[12.5px] font-medium">
                  Explore <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-32">
        <div className="eyebrow mb-4">Trending across categories</div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.slice(0, 6).map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group flex gap-4 p-4 rounded-2xl border border-line hover:border-ink/40 hover:bg-surface-2 transition-all">
              <div className="h-20 w-20 shrink-0 rounded-xl bg-surface-2 overflow-hidden">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-ink-muted">{p.category}</div>
                <div className="text-[14px] font-semibold text-ink truncate">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="display text-[16px]">{inr(p.price)}</span>
                  <span className="text-[11px] text-ink-muted line-through">{inr(p.mrp)}</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-ink-muted group-hover:text-ink self-start" />
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
