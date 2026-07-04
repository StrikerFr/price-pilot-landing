import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Heart,
  User,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Scale,
  TrendingDown,
  Bell,
  Tag,
  CalendarDays,
  Newspaper,
  Bot,
  Check,
  Minus,
  Plus,
} from "lucide-react";

import heroLaptop from "@/assets/hero-laptop.png";
import heroPhone from "@/assets/hero-phone.png";
import heroHeadphones from "@/assets/hero-headphones.png";
import catLaptops from "@/assets/cat-laptops.jpg";
import catPhones from "@/assets/cat-phones.jpg";
import catAudio from "@/assets/cat-audio.jpg";
import catGaming from "@/assets/cat-gaming.jpg";
import catMonitors from "@/assets/cat-monitors.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import dealKeyboard from "@/assets/deal-keyboard.jpg";
import dealWatch from "@/assets/deal-watch.jpg";
import dealEarbuds from "@/assets/deal-earbuds.jpg";
import dealCamera from "@/assets/deal-camera.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PricePilot — Shop Smarter with AI" },
      {
        name: "description",
        content:
          "PricePilot is the AI shopping copilot that finds the best products, compares prices across every store, and tells you exactly when to buy.",
      },
    ],
  }),
  component: LandingPage,
});

/* ---------- Nav ---------- */

const navItems = [
  "Deals",
  "Categories",
  "Compare",
  "Price Drops",
  "Sales Calendar",
  "News",
  "AI Assistant",
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-line"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-background text-[10px] font-semibold">
            P
          </span>
          <span className="display text-lg tracking-tight">PricePilot</span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="link-underline px-3 py-2 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2 transition-colors">
            <Search size={17} strokeWidth={1.6} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2 transition-colors">
            <Heart size={17} strokeWidth={1.6} />
          </button>
          <a
            href="#"
            className="hidden md:inline-flex items-center px-3 h-9 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Sign In
          </a>
          <button className="inline-flex items-center gap-1.5 h-9 pl-3 pr-2 rounded-full bg-ink text-background text-[13px] font-medium magnetic hover:bg-ink/90">
            Profile
            <span className="grid h-6 w-6 place-items-center rounded-full bg-background/15">
              <User size={13} strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

const placeholders = [
  "Gaming laptop under ₹90,000",
  "Best phone for photography",
  "Mechanical keyboard",
  "OLED monitor",
  "Wireless headphones",
];

function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % placeholders.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32">
      {/* Ambient shapes */}
      <div className="pointer-events-none absolute -right-32 top-24 h-[560px] w-[560px] rounded-full bg-[oklch(0.94_0.03_60)] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[oklch(0.95_0.02_75)] blur-3xl opacity-80" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 px-6 md:px-10">
        <div className="lg:col-span-6 lg:pt-6 anim-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 backdrop-blur px-3 py-1.5 text-[12px] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI shopping copilot · Live in India
          </div>

          <h1 className="display mt-8 text-[52px] sm:text-[68px] lg:text-[86px] leading-[0.92] text-balance">
            Stop opening
            <br />
            20 shopping tabs.
            <br />
            <span className="italic font-normal text-ink-soft" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              Shop smarter with{" "}
              <span className="not-italic text-accent">AI</span>.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            Find the best products, compare prices across every store,
            understand reviews instantly, and know exactly when to buy.
          </p>

          {/* AI search */}
          <div className="mt-10 group relative flex items-center gap-2 rounded-2xl border border-line bg-surface soft-shadow p-2 pl-5">
            <Sparkles size={18} className="text-accent shrink-0" strokeWidth={1.8} />
            <div className="relative flex-1 h-11 flex items-center overflow-hidden">
              <span className="pointer-events-none text-[15px] text-ink-muted">
                {placeholders[idx]}
              </span>
              <span className="ml-0.5 inline-block h-[18px] w-[2px] bg-ink-soft anim-caret" />
            </div>
            <button className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-ink text-background text-sm font-medium hover:bg-ink/90 transition-colors">
              Ask AI
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px]">
            <span className="text-ink-muted mr-1">Popular</span>
            {["iPhone 16 Pro", "Sony WH-1000XM6", "RTX 5070 laptop", "LG C4 OLED"].map(
              (t) => (
                <button
                  key={t}
                  className="rounded-full border border-line px-3 py-1.5 text-ink-soft hover:border-ink hover:text-ink transition-colors"
                >
                  {t}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Right composition */}
        <div className="lg:col-span-6 relative min-h-[520px] lg:min-h-[640px]">
          {/* Abstract shape */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full border border-line anim-spin-slow" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[280px] rounded-full bg-surface soft-shadow" />

          {/* Laptop */}
          <img
            src={heroLaptop}
            alt=""
            width={1024}
            height={768}
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[560px] anim-float drop-shadow-[0_40px_50px_rgba(60,40,20,0.15)]"
          />

          {/* Phone */}
          <img
            src={heroPhone}
            alt=""
            width={640}
            height={896}
            loading="lazy"
            className="absolute right-4 top-8 w-[130px] md:w-[170px] anim-float-slow drop-shadow-[0_30px_40px_rgba(60,40,20,0.18)]"
          />

          {/* Headphones */}
          <img
            src={heroHeadphones}
            alt=""
            width={768}
            height={768}
            loading="lazy"
            className="absolute left-2 bottom-4 w-[180px] md:w-[230px] anim-float drop-shadow-[0_30px_40px_rgba(60,40,20,0.15)]"
          />

          {/* Floating price tag */}
          <div className="absolute right-6 bottom-24 rounded-xl border border-line bg-surface/90 backdrop-blur px-3 py-2 text-[12px] soft-shadow anim-float-slow">
            <div className="text-ink-muted">Best price now</div>
            <div className="display text-lg text-ink">₹1,24,900</div>
            <div className="text-accent text-[11px] font-medium">↓ 12% today</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Trust marquee ---------- */

const stores = [
  "Amazon",
  "Flipkart",
  "Croma",
  "Reliance Digital",
  "Vijay Sales",
  "Official Brand Stores",
  "Tata CLiQ",
  "Myntra",
];

function TrustBar() {
  const row = [...stores, ...stores];
  return (
    <section className="border-y border-line bg-surface-2/60 py-6">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-8">
          <span className="eyebrow shrink-0 hidden md:inline">Trusted stores</span>
          <div className="hairline hidden md:block max-w-[80px]" />
          <div className="relative flex-1 overflow-hidden mask-fade">
            <div className="flex w-max anim-marquee gap-16">
              {row.map((s, i) => (
                <span
                  key={i}
                  className="display text-xl md:text-2xl text-ink-soft/70 whitespace-nowrap"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`.mask-fade{ -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);} `}</style>
    </section>
  );
}

/* ---------- Feature strip ---------- */

const features = [
  { icon: Search, label: "AI Product Search" },
  { icon: Scale, label: "Price Comparison" },
  { icon: Bot, label: "AI Review Summary" },
  { icon: TrendingDown, label: "Buy Now or Wait" },
  { icon: Tag, label: "Latest Deals" },
  { icon: CalendarDays, label: "Upcoming Sales" },
  { icon: Bell, label: "Wishlist Alerts" },
];

function FeatureStrip() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="eyebrow">01 — What it does</div>
            <h2 className="display mt-4 text-4xl md:text-6xl max-w-xl text-balance">
              Every step of buying, quietly automated.
            </h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center gap-1.5 link-underline text-sm text-ink-soft">
            See how it works <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="relative">
          <div className="hairline absolute top-8 left-0 right-0" />
          <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`group flex flex-col items-center text-center px-3 pt-1 pb-4 ${
                  i !== features.length - 1 ? "sm:border-r border-line" : ""
                }`}
              >
                <span className="relative -mt-3 grid h-14 w-14 place-items-center rounded-full bg-background border border-line group-hover:border-ink transition-colors">
                  <f.icon size={20} strokeWidth={1.5} className="text-ink" />
                </span>
                <span className="mt-5 text-[13px] font-medium text-ink">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Today's Deals ---------- */

const deals = [
  {
    img: dealKeyboard,
    name: "Keychron Q1 Pro",
    tag: "Mechanical Keyboard",
    price: "₹18,999",
    was: "₹24,999",
    drop: "-24%",
  },
  {
    img: dealWatch,
    name: "Series X Titanium",
    tag: "Smartwatch",
    price: "₹42,900",
    was: "₹49,900",
    drop: "-14%",
  },
  {
    img: dealEarbuds,
    name: "AirPods Pro 3",
    tag: "Wireless Earbuds",
    price: "₹21,499",
    was: "₹26,900",
    drop: "-20%",
  },
  {
    img: dealCamera,
    name: "Canon EOS R50",
    tag: "Mirrorless Camera",
    price: "₹64,900",
    was: "₹74,900",
    drop: "-13%",
  },
];

function TodaysDeals() {
  return (
    <section className="bg-surface-2/50 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="eyebrow">02 — Today's deals</div>
            <h2 className="display mt-4 text-4xl md:text-6xl max-w-2xl">
              Deals worth
              <br />
              your attention.
            </h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center gap-1.5 link-underline text-sm text-ink-soft">
            All deals <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {deals.map((d) => (
            <a
              key={d.name}
              href="#"
              className="group magnetic block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-full bg-ink text-background text-[11px] font-medium px-2.5 py-1">
                  {d.drop}
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] text-ink-muted">{d.tag}</div>
                  <div className="mt-1 text-[15px] font-medium text-ink">
                    {d.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-medium text-ink">{d.price}</div>
                  <div className="text-[12px] text-ink-muted line-through">
                    {d.was}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Shop by Category ---------- */

const categories = [
  { name: "Laptops", img: catLaptops, count: "1,240" },
  { name: "Phones", img: catPhones, count: "980" },
  { name: "Audio", img: catAudio, count: "1,540" },
  { name: "Gaming", img: catGaming, count: "720" },
  { name: "Monitors", img: catMonitors, count: "510" },
  { name: "Accessories", img: catAccessories, count: "3,120" },
];

function Categories() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-8">
            <div className="eyebrow">03 — Categories</div>
            <h2 className="display mt-4 text-4xl md:text-6xl text-balance">
              Every category,
              <br />
              curated by intent.
            </h2>
          </div>
          <p className="lg:col-span-4 text-ink-soft self-end max-w-sm">
            Not endless shelves. Just the products that actually matter,
            filtered by our AI against millions of reviews.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c, i) => (
            <a
              key={c.name}
              href="#"
              className={`group relative overflow-hidden rounded-3xl bg-surface-2 ${
                i === 0 ? "md:row-span-2 md:aspect-auto" : "aspect-[4/5]"
              }`}
              style={i === 0 ? { minHeight: "100%" } : undefined}
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between text-background">
                  <span className="text-[12px] opacity-80">{c.count} products</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-background/15 backdrop-blur border border-background/20 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <ArrowUpRight size={14} className="text-background" />
                  </span>
                </div>
                <div>
                  <h3 className="display text-2xl md:text-4xl text-background">
                    {c.name}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Compare Section ---------- */

const metrics = [
  { label: "Performance", a: 92, b: 84 },
  { label: "Battery", a: 78, b: 88 },
  { label: "Display", a: 95, b: 90 },
  { label: "Camera", a: 90, b: 82 },
  { label: "Build", a: 88, b: 86 },
  { label: "Value", a: 74, b: 92 },
];

function RadarCompare() {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 120;
  const n = metrics.length;

  const points = (values: number[]) =>
    values
      .map((v, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        const rr = (v / 100) * r;
        return `${cx + Math.cos(ang) * rr},${cy + Math.sin(ang) * rr}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <circle
          key={f}
          cx={cx}
          cy={cy}
          r={r * f}
          fill="none"
          stroke="oklch(0.9 0.006 75)"
          strokeWidth={1}
        />
      ))}
      {metrics.map((_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(ang) * r}
            y2={cy + Math.sin(ang) * r}
            stroke="oklch(0.9 0.006 75)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={points(metrics.map((m) => m.b))}
        fill="oklch(0.55 0.008 70 / 0.08)"
        stroke="oklch(0.35 0.01 70)"
        strokeWidth={1.5}
      />
      <polygon
        points={points(metrics.map((m) => m.a))}
        fill="oklch(0.68 0.17 45 / 0.12)"
        stroke="oklch(0.68 0.17 45)"
        strokeWidth={1.5}
      />
      {metrics.map((m, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        const lx = cx + Math.cos(ang) * (r + 22);
        const ly = cy + Math.sin(ang) * (r + 22);
        return (
          <text
            key={m.label}
            x={lx}
            y={ly}
            fontSize="10"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(0.35 0.01 70)"
          >
            {m.label}
          </text>
        );
      })}
    </svg>
  );
}

function Compare() {
  return (
    <section className="border-t border-line bg-background py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-center mb-20">
          <div className="eyebrow">04 — AI Comparison</div>
          <h2 className="display mt-6 text-5xl md:text-8xl leading-[0.9] text-balance">
            Compare less.
            <br />
            <span className="text-ink-muted">Choose better.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <ProductCard
              img={heroPhone}
              name="Aurora Pro 15"
              tag="Flagship · 256GB"
              price="₹1,24,900"
              winner
            />
          </div>

          <div className="lg:col-span-4">
            <div className="relative">
              <div className="absolute inset-0 bg-surface-2/60 rounded-[32px] -m-4" />
              <div className="relative">
                <RadarCompare />
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Aurora Pro 15
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-ink" />
                  Meridian X
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <ProductCard
              img={heroLaptop}
              name="Meridian X"
              tag="Ultrabook · 512GB"
              price="₹1,08,500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  img,
  name,
  tag,
  price,
  winner,
}: {
  img: string;
  name: string;
  tag: string;
  price: string;
  winner?: boolean;
}) {
  return (
    <div className="relative rounded-3xl bg-surface border border-line p-6 soft-shadow">
      {winner && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-[11px] font-medium px-2.5 py-1">
          <Sparkles size={11} /> AI pick
        </span>
      )}
      <div className="aspect-square grid place-items-center">
        <img src={img} alt={name} className="max-h-[85%] w-auto anim-float" />
      </div>
      <div className="mt-4">
        <div className="text-[12px] text-ink-muted">{tag}</div>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <div className="display text-xl">{name}</div>
          <div className="text-[15px] font-medium text-ink">{price}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- AI Review ---------- */

function AIReview() {
  return (
    <section className="bg-surface-2/60 py-28 md:py-36 border-y border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="eyebrow">05 — Review intelligence</div>
          <h2 className="display mt-6 text-4xl md:text-6xl text-balance">
            18,432 reviews.
            <br />
            One honest answer.
          </h2>
          <p className="mt-6 text-ink-soft max-w-md">
            Our AI reads every review across every store — verified, video,
            long-form, and translated — then tells you the truth.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-[13px] text-ink-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            AI is analyzing 18,432 reviews for Aurora Pro 15
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-surface border border-line p-8 md:p-10 soft-shadow">
            <div className="flex items-center gap-2 text-[12px] text-ink-muted mb-8">
              <Bot size={14} /> PricePilot AI · Verdict
              <span className="ml-auto">4.6 · Excellent</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="eyebrow mb-4 flex items-center gap-2">
                  <Plus size={12} /> Pros
                </div>
                <ul className="space-y-3 text-[15px]">
                  {[
                    "Class-leading OLED at this price",
                    "Battery reliably exceeds 12 hours",
                    "Silent under normal workloads",
                  ].map((p) => (
                    <li key={p} className="flex gap-3">
                      <Check size={16} className="mt-1 text-accent shrink-0" />
                      <span className="text-ink">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="eyebrow mb-4 flex items-center gap-2">
                  <Minus size={12} /> Cons
                </div>
                <ul className="space-y-3 text-[15px]">
                  {[
                    "Webcam quality is average",
                    "Only two USB-C ports",
                    "Fingerprint-prone finish",
                  ].map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 h-[3px] w-3 bg-ink-muted shrink-0" />
                      <span className="text-ink">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-line">
              <div className="eyebrow mb-3">Final verdict</div>
              <p className="text-[17px] leading-relaxed text-ink text-balance">
                The Aurora Pro 15 is the most confident pick under ₹1.3L today —
                buy it if OLED and battery matter more than port variety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Buy Now or Wait ---------- */

function PriceHistory() {
  const points = [78, 82, 80, 74, 76, 70, 66, 68, 62, 58, 60, 55];
  const w = 600;
  const h = 180;
  const step = w / (points.length - 1);
  const max = 90;
  const min = 45;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y(p)}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full h-auto">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.17 45)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.68 0.17 45)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path d={path} fill="none" stroke="oklch(0.68 0.17 45)" strokeWidth={2} />
      <circle
        cx={(points.length - 1) * step}
        cy={y(points[points.length - 1])}
        r={5}
        fill="oklch(0.68 0.17 45)"
      />
      <circle
        cx={(points.length - 1) * step}
        cy={y(points[points.length - 1])}
        r={10}
        fill="oklch(0.68 0.17 45)"
        opacity={0.2}
      />
    </svg>
  );
}

function BuyOrWait() {
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-8">
            <div className="eyebrow">06 — Timing intelligence</div>
            <h2 className="display mt-4 text-4xl md:text-7xl text-balance">
              Buy today,
              <br />
              or wait 12 days.
            </h2>
          </div>
          <p className="lg:col-span-4 text-ink-soft">
            We track every price across the internet, every hour. Then we tell
            you the smartest moment to click buy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 rounded-3xl bg-surface border border-line p-8 md:p-10 soft-shadow">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
              <div>
                <div className="text-[12px] text-ink-muted">Current price</div>
                <div className="display text-5xl md:text-6xl mt-2">₹1,24,900</div>
                <div className="text-[13px] text-accent mt-1">↓ ₹8,100 vs 30-day avg</div>
              </div>
              <div className="flex gap-2 text-[12px]">
                {["30d", "90d", "1y", "All"].map((r, i) => (
                  <button
                    key={r}
                    className={`px-3 py-1.5 rounded-full border ${
                      i === 1
                        ? "border-ink text-ink"
                        : "border-line text-ink-muted hover:border-ink hover:text-ink"
                    } transition-colors`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <PriceHistory />
            <div className="mt-6 flex justify-between text-[11px] text-ink-muted">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Now</span>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl bg-ink text-background p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] opacity-70">
                <Sparkles size={14} /> AI Verdict
              </div>
              <div className="display text-4xl md:text-5xl mt-6 leading-[1]">
                Wait
                <br />
                12 days.
              </div>
              <p className="mt-5 text-[14px] opacity-80 leading-relaxed">
                Great Indian Festival begins Oct 8. Historically this model drops
                a further 9–14% in the first 48 hours.
              </p>
            </div>
            <div className="mt-10 flex items-center justify-between">
              <button className="inline-flex items-center gap-2 text-[13px] link-underline">
                Notify me <Bell size={14} />
              </button>
              <span className="text-[11px] opacity-60">Confidence · 87%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Upcoming Sales ---------- */

const sales = [
  { name: "Prime Day", store: "Amazon", when: "Jul 15 – 16", days: 4 },
  { name: "Great Indian Festival", store: "Amazon", when: "Oct 8 – 15", days: 89 },
  { name: "Big Billion Days", store: "Flipkart", when: "Oct 9 – 15", days: 90 },
  { name: "Black Friday", store: "Global", when: "Nov 28", days: 140 },
];

function UpcomingSales() {
  return (
    <section className="bg-surface-2/50 py-28 md:py-36 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14">
          <div className="eyebrow">07 — Sales calendar</div>
          <h2 className="display mt-4 text-4xl md:text-6xl text-balance max-w-2xl">
            The next great sale,
            <br />
            already circled.
          </h2>
        </div>

        <div className="relative">
          <div className="hairline absolute top-6 left-0 right-0" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {sales.map((s, i) => (
              <div key={s.name} className="pt-14 group">
                <div className="relative">
                  <span className="absolute -top-14 left-0 grid h-12 w-12 place-items-center rounded-full bg-background border border-line text-[11px] font-medium text-ink group-hover:border-ink transition-colors">
                    0{i + 1}
                  </span>
                </div>
                <div className="text-[12px] text-ink-muted">{s.store}</div>
                <div className="display text-2xl md:text-3xl mt-2 text-balance">
                  {s.name}
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
                  <span className="text-[13px] text-ink-soft">{s.when}</span>
                  <span className="text-[13px] font-medium text-accent">
                    {s.days}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Trending ---------- */

const trending = [
  { img: dealCamera, name: "Canon EOS R50", cat: "Cameras" },
  { img: dealEarbuds, name: "AirPods Pro 3", cat: "Audio" },
  { img: dealWatch, name: "Series X Titanium", cat: "Wearables" },
  { img: dealKeyboard, name: "Keychron Q1 Pro", cat: "Keyboards" },
  { img: catLaptops, name: "Ultrabook Slim 14", cat: "Laptops" },
  { img: catPhones, name: "Aurora Pro 15", cat: "Phones" },
];

function Trending() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-12 gap-8">
          <div>
            <div className="eyebrow">08 — Trending now</div>
            <h2 className="display mt-4 text-4xl md:text-6xl">
              What India is buying.
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
              className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-ink transition-colors"
              aria-label="Scroll left"
            >
              <ArrowRight size={16} className="rotate-180" />
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
              className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-ink transition-colors"
              aria-label="Scroll right"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pl-6 md:pl-10 pr-6 md:pr-10 pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {trending.map((t, i) => (
          <a
            key={i}
            href="#"
            className="group shrink-0 w-[280px] md:w-[380px] snap-start"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-2">
              <img
                src={t.img}
                alt={t.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 text-[11px] font-medium text-background bg-ink/70 backdrop-blur rounded-full px-2.5 py-1">
                #{i + 1} Trending
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="text-[12px] text-ink-muted">{t.cat}</div>
                <div className="text-[16px] font-medium text-ink mt-0.5">
                  {t.name}
                </div>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-line group-hover:border-ink group-hover:bg-ink group-hover:text-background transition-all">
                <ArrowUpRight size={14} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink text-background py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[oklch(0.5_0.05_60)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 text-center">
        <div className="eyebrow text-background/60">Ready when you are</div>
        <h2 className="display mt-8 text-6xl md:text-9xl leading-[0.9] text-balance">
          Ready to shop
          <br />
          <span className="italic font-normal opacity-80">smarter?</span>
        </h2>
        <p className="mt-8 max-w-xl mx-auto text-background/70 text-[17px]">
          One search. Every store. The smartest buying decision.
        </p>

        <div className="mt-12 mx-auto max-w-2xl flex items-center gap-2 rounded-2xl bg-background/10 backdrop-blur border border-background/15 p-2 pl-5">
          <Sparkles size={18} className="text-accent shrink-0" />
          <span className="flex-1 text-left text-background/60 text-[15px] py-3">
            Ask anything — "Best OLED TV under ₹80,000"
          </span>
          <button className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-background text-ink text-sm font-medium hover:bg-background/90 transition-colors">
            Ask AI <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const cols = useMemo(
    () => [
      {
        title: "Shop",
        links: ["Deals", "Categories", "Trending", "Price Drops", "Sales Calendar"],
      },
      {
        title: "Intelligence",
        links: ["AI Search", "Compare", "Review Summary", "Buy or Wait", "Alerts"],
      },
      {
        title: "Company",
        links: ["About", "Careers", "Press", "Contact", "Blog"],
      },
      {
        title: "Legal",
        links: ["Privacy", "Terms", "Cookies", "Affiliate disclosure"],
      },
    ],
    [],
  );

  return (
    <footer className="bg-background border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-background text-[11px] font-semibold">
                P
              </span>
              <span className="display text-xl">PricePilot</span>
            </div>
            <p className="mt-6 max-w-xs text-ink-soft text-[14px] leading-relaxed">
              The AI shopping copilot. Every store, every price, every review —
              in one calm interface.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-[12px] text-ink-muted">
              <span className="h-2 w-2 rounded-full bg-accent" />
              All systems normal · Live prices
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="eyebrow mb-5">{c.title}</div>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="link-underline text-[14px] text-ink-soft hover:text-ink transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-ink-muted">
          <span>© 2026 PricePilot. Crafted in Bengaluru.</span>
          <span>Prices in ₹ · Updated hourly</span>
        </div>

        <div className="display mt-20 text-[18vw] leading-[0.85] tracking-tighter text-ink/[0.06] select-none pointer-events-none">
          PricePilot
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <FeatureStrip />
        <TodaysDeals />
        <Categories />
        <Compare />
        <AIReview />
        <BuyOrWait />
        <UpcomingSales />
        <Trending />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
