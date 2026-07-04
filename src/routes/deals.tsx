import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Flame,
  Clock,
  Check,
  Store,
  Truck,
  BadgePercent,
  Zap,
  ChevronRight,
} from "lucide-react";

import heroHeadphones from "@/assets/hero-headphones.png";
import heroLaptop from "@/assets/hero-laptop.png";
import heroPhone from "@/assets/hero-phone.png";
import dealKeyboard from "@/assets/deal-keyboard.jpg";
import dealWatch from "@/assets/deal-watch.jpg";
import dealEarbuds from "@/assets/deal-earbuds.jpg";
import dealCamera from "@/assets/deal-camera.jpg";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Today's Best Deals — PricePilot" },
      {
        name: "description",
        content:
          "AI-curated deals worth buying today. PricePilot analyzes prices across every major retailer and only surfaces the deals that actually matter.",
      },
      { property: "og:title", content: "Today's Best Deals — PricePilot" },
      {
        property: "og:description",
        content:
          "Deals actually worth buying. Curated by AI. Compared across every store.",
      },
    ],
  }),
  component: DealsPage,
});

/* ============================================================
   Data
============================================================ */

const quickFilters = [
  "Electronics",
  "Gaming",
  "Phones",
  "Laptops",
  "Audio",
  "Home",
  "Accessories",
  "Monitors",
];

type Verdict = "Excellent Deal" | "Good Deal" | "Average" | "Wait" | "Overpriced";

const verdictStyle: Record<Verdict, { dot: string; text: string; ring: string }> = {
  "Excellent Deal": {
    dot: "bg-[oklch(0.68_0.17_45)]",
    text: "text-[oklch(0.42_0.14_45)]",
    ring: "ring-[oklch(0.68_0.17_45)]/25",
  },
  "Good Deal": {
    dot: "bg-[oklch(0.62_0.14_155)]",
    text: "text-[oklch(0.38_0.12_155)]",
    ring: "ring-[oklch(0.62_0.14_155)]/25",
  },
  Average: {
    dot: "bg-[oklch(0.55_0.02_70)]",
    text: "text-[oklch(0.35_0.02_70)]",
    ring: "ring-[oklch(0.55_0.02_70)]/25",
  },
  Wait: {
    dot: "bg-[oklch(0.72_0.14_75)]",
    text: "text-[oklch(0.42_0.12_75)]",
    ring: "ring-[oklch(0.72_0.14_75)]/25",
  },
  Overpriced: {
    dot: "bg-[oklch(0.6_0.22_27)]",
    text: "text-[oklch(0.42_0.18_27)]",
    ring: "ring-[oklch(0.6_0.22_27)]/25",
  },
};

type Deal = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  original: number;
  store: string;
  verdict: Verdict;
  score: number;
  insight: string;
  history: number[];
  lowestEver: number;
  average: number;
};

const featuredDeal: Deal = {
  id: "sony-xm6",
  name: "Sony WH-1000XM6",
  brand: "Sony",
  category: "Audio",
  image: heroHeadphones,
  price: 24990,
  original: 34990,
  store: "Amazon",
  verdict: "Excellent Deal",
  score: 96,
  insight: "Lowest price in 11 months. Better than 94% of historical prices.",
  history: [34, 33, 33, 32, 30, 29, 29, 28, 27, 26, 25, 24.99],
  lowestEver: 24500,
  average: 30100,
};

const deals: Deal[] = [
  {
    id: "macbook-air-m4",
    name: "MacBook Air M4 13\"",
    brand: "Apple",
    category: "Laptops",
    image: heroLaptop,
    price: 92990,
    original: 114900,
    store: "Croma",
    verdict: "Excellent Deal",
    score: 94,
    insight: "🔥 Lowest price in 8 months. Beats Prime Day by ₹1,200.",
    history: [115, 114, 112, 110, 108, 105, 102, 100, 98, 96, 94, 92.99],
    lowestEver: 92500,
    average: 105400,
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro 256GB",
    brand: "Apple",
    category: "Phones",
    image: heroPhone,
    price: 118900,
    original: 129900,
    store: "Flipkart",
    verdict: "Good Deal",
    score: 82,
    insight: "📈 Better than 71% of prices. May drop ₹3k during Diwali sale.",
    history: [130, 129, 128, 128, 126, 124, 123, 122, 121, 120, 119, 118.9],
    lowestEver: 116400,
    average: 124200,
  },
  {
    id: "keychron-q1",
    name: "Keychron Q1 Pro",
    brand: "Keychron",
    category: "Accessories",
    image: dealKeyboard,
    price: 18999,
    original: 24999,
    store: "Official Store",
    verdict: "Excellent Deal",
    score: 91,
    insight: "💻 Great value for creators. All-time low on the Pro variant.",
    history: [25, 25, 24, 24, 23, 22, 22, 21, 20, 20, 19, 18.99],
    lowestEver: 18999,
    average: 22100,
  },
  {
    id: "apple-watch-series-10",
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Wearables",
    image: dealWatch,
    price: 41900,
    original: 46900,
    store: "Reliance",
    verdict: "Wait",
    score: 62,
    insight: "⚠ Usually drops another ₹2,500 during Great Indian Festival.",
    history: [47, 46, 46, 45, 45, 44, 44, 43, 43, 42, 42, 41.9],
    lowestEver: 39500,
    average: 44100,
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    brand: "Apple",
    category: "Audio",
    image: dealEarbuds,
    price: 21900,
    original: 26900,
    store: "Amazon",
    verdict: "Good Deal",
    score: 79,
    insight: "📈 Better than 68% of historical prices. Solid mid-cycle buy.",
    history: [27, 27, 26, 26, 25, 25, 24, 24, 23, 22, 22, 21.9],
    lowestEver: 20900,
    average: 24800,
  },
  {
    id: "canon-r50",
    name: "Canon EOS R50",
    brand: "Canon",
    category: "Cameras",
    image: dealCamera,
    price: 54990,
    original: 66995,
    store: "Vijay Sales",
    verdict: "Excellent Deal",
    score: 89,
    insight: "🔥 Kit lens included. Lowest bundle price seen this year.",
    history: [67, 66, 65, 64, 63, 62, 60, 59, 58, 57, 56, 54.99],
    lowestEver: 54990,
    average: 61200,
  },
];

const buyOrWait: {
  id: string;
  name: string;
  image: string;
  action: "Buy Now" | "Wait";
  current: number;
  expected: number;
  confidence: number;
  reason: string;
  event: string;
}[] = [
  {
    id: "sony-xm6-b",
    name: "Sony WH-1000XM6",
    image: heroHeadphones,
    action: "Buy Now",
    current: 24990,
    expected: 25400,
    confidence: 92,
    reason: "Prices have plateaued near the yearly low.",
    event: "No major sale in next 45 days",
  },
  {
    id: "apple-watch-s10",
    name: "Apple Watch Series 10",
    image: dealWatch,
    action: "Wait",
    current: 41900,
    expected: 38900,
    confidence: 84,
    reason: "Historically drops during Great Indian Festival.",
    event: "GIF — Oct 8 (14 days)",
  },
  {
    id: "iphone-16-pro-b",
    name: "iPhone 16 Pro 256GB",
    image: heroPhone,
    action: "Wait",
    current: 118900,
    expected: 115400,
    confidence: 76,
    reason: "Small drop expected once Diwali offers stack with bank cashback.",
    event: "Diwali — Oct 24 (30 days)",
  },
];

const trending = [
  { name: "MacBook Air M4", image: heroLaptop, cat: "Laptops", drop: "-19%" },
  { name: "AirPods Pro 3", image: dealEarbuds, cat: "Audio", drop: "-19%" },
  { name: "Canon EOS R50", image: dealCamera, cat: "Cameras", drop: "-18%" },
  { name: "Sony WH-1000XM6", image: heroHeadphones, cat: "Audio", drop: "-29%" },
];

const stores = [
  { name: "Amazon", price: 24990, delivery: "Tomorrow", offer: "10% HDFC" },
  { name: "Flipkart", price: 25299, delivery: "2 days", offer: "5% Axis" },
  { name: "Croma", price: 25990, delivery: "3 days", offer: "No-cost EMI" },
  { name: "Reliance", price: 26490, delivery: "4 days", offer: "₹500 off" },
  { name: "Vijay Sales", price: 25490, delivery: "2 days", offer: "Bundle deal" },
  { name: "Sony Store", price: 27990, delivery: "Free", offer: "2yr warranty" },
];

const filterChips = [
  "All",
  "Buy Now",
  "Wait Recommended",
  "Price Drop",
  "Latest",
  "Under ₹25k",
  "Excellent Only",
];

const liveTicker = [
  { name: "MacBook Air M4", drop: "₹4,000" },
  { name: "RTX 5070", drop: "₹3,200" },
  { name: "Sony WH-1000XM6", drop: "₹1,100" },
  { name: "AirPods Pro 3", drop: "₹800" },
  { name: "Keychron Q1 Pro", drop: "₹1,500" },
  { name: "iPhone 16 Pro", drop: "₹2,000" },
  { name: "Canon EOS R50", drop: "₹5,500" },
  { name: "Apple Watch S10", drop: "₹1,900" },
];

/* ============================================================
   Small building blocks
============================================================ */

const money = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const s = verdictStyle[verdict];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-[11px] font-medium ring-1 ${s.ring} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {verdict}
    </span>
  );
}

function Sparkline({
  data,
  color = "currentColor",
  strokeWidth = 1.5,
  fill = false,
  height = 42,
  width = 180,
}: {
  data: number[];
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  height?: number;
  width?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(0.001, max - min);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = fill
    ? `${path} L ${width} ${height} L 0 ${height} Z`
    : "";
  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && (
        <path
          d={area}
          fill={color}
          opacity={0.12}
          className="[--start:0] animate-[dash_1.4s_ease-out_forwards]"
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 800,
          strokeDashoffset: 800,
          animation: "sparkline-draw 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards",
        }}
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r={3}
        fill={color}
      />
    </svg>
  );
}

/* ============================================================
   Nav
============================================================ */

function DealsNav() {
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
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-background text-[10px] font-semibold">
            P
          </span>
          <span className="display text-lg tracking-tight">PricePilot</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {["Deals", "Categories", "Compare", "Price Drops", "Sales Calendar", "News", "AI Assistant"].map(
            (item) => {
              const active = item === "Deals";
              return (
                <Link
                  key={item}
                  to={item === "Deals" ? "/deals" : "/"}
                  className={`px-3 py-2 text-[13px] font-medium transition-colors link-underline ${
                    active ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {item}
                </Link>
              );
            },
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <button className="inline-flex items-center gap-1.5 h-9 pl-3 pr-3 rounded-full bg-ink text-background text-[13px] font-medium magnetic hover:bg-ink/90">
            Track a price
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   Hero
============================================================ */

function Hero() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 40, on: false });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setSpot({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
        on: true,
      });
    };
    const leave = () => setSpot((s) => ({ ...s, on: false }));
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28"
    >
      {/* Ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 20% 10%, oklch(0.97 0.03 65 / 0.9), transparent 60%), radial-gradient(70% 50% at 90% 30%, oklch(0.96 0.04 30 / 0.65), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.2 0.02 60) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.2 0.02 60) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(500px circle at ${spot.x}% ${spot.y}%, oklch(1 0.03 75 / 0.7), transparent 60%)`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-ink-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Live · updated 32 seconds ago
        </div>

        <h1
          className="display mt-8 text-ink text-balance"
          style={{
            fontSize: "clamp(48px, 9vw, 128px)",
            lineHeight: 0.94,
            letterSpacing: "-0.045em",
          }}
        >
          Today's best deals.
          <br />
          <span className="text-ink-soft font-normal">
            Only the ones worth buying.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-[17px] md:text-[19px] text-ink-soft leading-relaxed">
          Our AI continuously analyzes prices across every major retailer and
          only surfaces deals worth your attention. No coupons, no clutter —
          just what actually matters today.
        </p>

        {/* Search */}
        <div className="mt-12 max-w-3xl">
          <div className="group relative flex items-center h-16 md:h-[72px] rounded-full bg-surface ring-1 ring-line hover:ring-ink/40 focus-within:ring-ink transition-all shadow-[0_20px_50px_-30px_oklch(0.15_0.02_60_/_0.35)]">
            <Search
              size={18}
              strokeWidth={1.6}
              className="absolute left-6 text-ink-soft"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands or categories…"
              className="h-full w-full bg-transparent pl-14 pr-40 text-[15px] md:text-[16px] text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button className="absolute right-2 inline-flex items-center gap-2 h-12 md:h-14 pl-5 pr-4 rounded-full bg-ink text-background text-[13px] font-medium hover:bg-ink/90 transition-colors">
              Ask AI
              <span className="grid h-8 w-8 place-items-center rounded-full bg-background/15">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </div>

          {/* Quick filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            {quickFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(active === f ? null : f)}
                className={`group/pill relative overflow-hidden rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                  active === f
                    ? "bg-ink text-background"
                    : "bg-surface ring-1 ring-line text-ink-soft hover:text-ink hover:ring-ink/40 hover:-translate-y-0.5"
                }`}
              >
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-3xl">
          {[
            { k: "Deals reviewed today", v: "12,480" },
            { k: "Retailers tracked", v: "42" },
            { k: "Avg. saved / user", v: "₹4,120" },
            { k: "Buy-now confidence", v: "94%" },
          ].map((m) => (
            <div key={m.k}>
              <div className="text-[11px] tracking-[0.22em] uppercase text-ink-muted">
                {m.k}
              </div>
              <div className="mt-2 display text-2xl md:text-3xl text-ink">
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Live ticker
============================================================ */

function LiveTicker() {
  return (
    <section className="relative border-y border-line/70 bg-surface/40 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-4 flex items-center gap-6">
        <span className="text-[10px] tracking-[0.28em] uppercase text-ink-muted flex items-center gap-2 whitespace-nowrap">
          <Zap size={12} strokeWidth={1.8} className="text-accent" />
          Live drops
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex gap-12 whitespace-nowrap"
            style={{ animation: "marquee 45s linear infinite" }}
          >
            {[...liveTicker, ...liveTicker, ...liveTicker].map((t, i) => (
              <span
                key={i}
                className="text-[13px] text-ink-soft flex items-center gap-3"
              >
                <span className="text-ink">{t.name}</span>
                <TrendingDown size={13} className="text-accent" />
                <span className="text-ink-muted">{t.drop}</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Featured Deal — editorial spread
============================================================ */

function FeaturedDeal() {
  const d = featuredDeal;
  const saved = d.original - d.price;
  const pct = Math.round((saved / d.original) * 100);

  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-14 md:mb-20">
          <div>
            <div className="eyebrow">Featured · Deal of the day</div>
            <h2 className="display mt-4 text-4xl md:text-6xl text-balance">
              The one we'd buy
              <br />
              <span className="text-ink-soft font-normal">
                if we could buy one thing today.
              </span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[12px] text-ink-muted">
            <Clock size={14} strokeWidth={1.6} />
            Expires in 14h 22m
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Product visual */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[5/4] rounded-[36px] overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.02_65)] via-[oklch(0.95_0.03_45)] to-[oklch(0.93_0.04_30)]">
              {/* Aurora blobs */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -left-24 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-60 mix-blend-multiply"
                style={{
                  background:
                    "radial-gradient(closest-side, oklch(0.82 0.14 55 / 0.5), transparent 70%)",
                  animation: "float-y-slow 8s ease-in-out infinite",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-24 h-[55vh] w-[55vh] rounded-full blur-3xl opacity-50 mix-blend-multiply"
                style={{
                  background:
                    "radial-gradient(closest-side, oklch(0.78 0.14 30 / 0.45), transparent 70%)",
                  animation: "float-y 10s ease-in-out infinite",
                }}
              />

              {/* Product */}
              <img
                src={d.image}
                alt={d.name}
                className="absolute inset-0 h-full w-full object-contain p-12 md:p-20 drop-shadow-[0_40px_60px_oklch(0.15_0.02_60_/_0.25)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.03]"
              />

              {/* Corner brackets */}
              <div className="pointer-events-none absolute inset-6 md:inset-8">
                {[
                  "top-0 left-0 border-t border-l",
                  "top-0 right-0 border-t border-r",
                  "bottom-0 left-0 border-b border-l",
                  "bottom-0 right-0 border-b border-r",
                ].map((c) => (
                  <span
                    key={c}
                    className={`absolute h-4 w-4 border-ink/25 ${c}`}
                  />
                ))}
              </div>

              {/* Floating verdict pill */}
              <div className="absolute top-6 left-6">
                <VerdictBadge verdict={d.verdict} />
              </div>

              {/* Floating price chip */}
              <div className="absolute bottom-6 right-6 rounded-2xl bg-background/85 backdrop-blur-md ring-1 ring-line px-4 py-3 shadow-lg">
                <div className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
                  Saved
                </div>
                <div className="mt-1 display text-2xl text-ink">
                  {money(saved)}
                </div>
              </div>
            </div>

            {/* Under-image meta */}
            <div className="mt-6 flex items-center justify-between text-[12px] text-ink-muted">
              <div className="flex items-center gap-2">
                <Store size={13} strokeWidth={1.6} />
                {d.store} · sold & shipped
              </div>
              <div className="flex items-center gap-2">
                <Truck size={13} strokeWidth={1.6} />
                Free delivery by Tomorrow
              </div>
            </div>
          </div>

          {/* Editorial column */}
          <div className="lg:col-span-5">
            <div className="eyebrow flex items-center gap-2">
              <Sparkles size={12} strokeWidth={1.8} className="text-accent" />
              AI Verdict · {d.score}/100
            </div>

            <h3
              className="display mt-4 text-ink text-balance"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
              }}
            >
              {d.name}
            </h3>

            <p className="mt-6 text-[15px] text-ink-soft leading-relaxed max-w-md">
              Class-leading noise cancellation, a genuine 30-hour battery, and
              the best travel-audio experience under ₹30k. Right now, at the
              lowest price we've tracked in almost a year.
            </p>

            {/* Price stack */}
            <div className="mt-10 flex items-end gap-4 flex-wrap">
              <div className="display text-6xl md:text-7xl text-ink tracking-tight">
                {money(d.price)}
              </div>
              <div className="pb-2">
                <div className="text-[13px] text-ink-muted line-through">
                  {money(d.original)}
                </div>
                <div className="text-[13px] text-accent font-semibold mt-0.5">
                  -{pct}% off
                </div>
              </div>
            </div>

            {/* AI insight card */}
            <div className="mt-8 rounded-2xl bg-surface ring-1 ring-line p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                  <Flame size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-[13px] text-ink font-medium">
                    Lowest price in 11 months
                  </div>
                  <div className="text-[13px] text-ink-soft mt-0.5">
                    {d.insight}
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-line pt-4 grid grid-cols-3 gap-4 text-[12px]">
                <div>
                  <div className="text-ink-muted">Lowest ever</div>
                  <div className="mt-1 text-ink font-medium">
                    {money(d.lowestEver)}
                  </div>
                </div>
                <div>
                  <div className="text-ink-muted">90-day avg</div>
                  <div className="mt-1 text-ink font-medium">
                    {money(d.average)}
                  </div>
                </div>
                <div>
                  <div className="text-ink-muted">Trend</div>
                  <div className="mt-1 text-ink font-medium flex items-center gap-1">
                    <TrendingDown size={12} className="text-accent" />
                    Falling
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 h-12 pl-5 pr-4 rounded-full bg-ink text-background text-[14px] font-medium magnetic hover:bg-ink/90">
                Buy on {d.store}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-background/15">
                  <ArrowUpRight size={14} />
                </span>
              </button>
              <button className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-surface ring-1 ring-line text-ink text-[14px] font-medium hover:ring-ink/40 transition-all">
                Compare 6 stores
                <ChevronRight size={14} />
              </button>
              <button className="text-[13px] text-ink-soft hover:text-ink transition-colors link-underline">
                Track this price
              </button>
            </div>
          </div>
        </div>

        {/* Price history strip */}
        <div className="mt-16 md:mt-24 rounded-[28px] bg-surface ring-1 ring-line p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <div className="eyebrow">Price history · 12 months</div>
            <h4 className="display mt-3 text-2xl md:text-3xl text-ink">
              A rare, real drop.
            </h4>
            <p className="mt-3 text-[13px] text-ink-soft">
              Twelve months of tracked prices. This week is the lowest we've
              recorded — worth acting on today.
            </p>
          </div>
          <div className="md:col-span-8 relative">
            <div className="text-ink-soft">
              <Sparkline
                data={d.history}
                width={640}
                height={140}
                strokeWidth={2}
                fill
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-6 text-[12px]">
              <div>
                <div className="text-ink-muted">Current</div>
                <div className="mt-1 text-ink font-medium">
                  {money(d.price)}
                </div>
              </div>
              <div>
                <div className="text-ink-muted">Average</div>
                <div className="mt-1 text-ink font-medium">
                  {money(d.average)}
                </div>
              </div>
              <div>
                <div className="text-ink-muted">Lowest ever</div>
                <div className="mt-1 text-ink font-medium">
                  {money(d.lowestEver)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store comparison */}
        <div className="mt-10 rounded-[28px] bg-surface ring-1 ring-line overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-line">
            <div className="flex items-center gap-3">
              <BadgePercent size={16} className="text-accent" />
              <span className="text-[13px] font-medium text-ink">
                Store comparison · {d.name}
              </span>
            </div>
            <span className="text-[11px] tracking-[0.22em] uppercase text-ink-muted">
              6 retailers
            </span>
          </div>
          <div className="divide-y divide-line">
            {stores.map((s, i) => {
              const isBest = i === 0;
              return (
                <div
                  key={s.name}
                  className={`grid grid-cols-12 items-center gap-4 px-8 py-4 text-[13px] transition-colors ${
                    isBest ? "bg-accent/[0.04]" : "hover:bg-surface-2/40"
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-3 text-ink">
                    {isBest && (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-background">
                        <Check size={12} strokeWidth={2.4} />
                      </span>
                    )}
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <div className="col-span-3 text-ink-soft">
                    Delivery · {s.delivery}
                  </div>
                  <div className="col-span-3 text-ink-soft">{s.offer}</div>
                  <div className="col-span-2 text-right text-ink font-medium">
                    {money(s.price)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <span className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-line text-ink-soft hover:text-ink hover:ring-ink/40 transition-all">
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Sticky filter bar + Today's Hot Deals grid
============================================================ */

function HotDeals() {
  const [chip, setChip] = useState("All");

  return (
    <section className="relative py-24 md:py-32 bg-surface-2/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-10 flex-wrap">
          <div>
            <div className="eyebrow">Today's hot deals</div>
            <h2 className="display mt-4 text-4xl md:text-6xl text-balance">
              Handpicked, not
              <br />
              <span className="text-ink-soft font-normal">
                algorithm-flooded.
              </span>
            </h2>
          </div>
          <div className="text-[13px] text-ink-muted max-w-sm">
            Six deals our AI would actually buy today, out of the 12,480 it
            reviewed this morning.
          </div>
        </div>

        {/* Sticky filter chip bar */}
        <div className="sticky top-16 z-30 -mx-6 md:-mx-10 px-6 md:px-10 py-3 bg-background/70 backdrop-blur-xl border-y border-line/70">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterChips.map((c) => (
              <button
                key={c}
                onClick={() => setChip(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-medium transition-all duration-300 ${
                  chip === c
                    ? "bg-ink text-background"
                    : "bg-surface ring-1 ring-line text-ink-soft hover:text-ink hover:ring-ink/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {deals.map((d, i) => (
            <DealCard key={d.id} d={d} highlight={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DealCard({ d, highlight = false }: { d: Deal; highlight?: boolean }) {
  const pct = Math.round(((d.original - d.price) / d.original) * 100);
  const s = verdictStyle[d.verdict];
  return (
    <a
      href="#"
      className={`group relative flex flex-col overflow-hidden rounded-[28px] bg-surface ring-1 ring-line transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_oklch(0.15_0.02_60_/_0.25)] hover:ring-ink/20 ${
        highlight ? "lg:col-span-1" : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.015_75)] via-[oklch(0.955_0.02_60)] to-[oklch(0.94_0.025_45)]">
        <img
          src={d.image}
          alt={d.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
        />
        {/* Soft top light */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent" />
        {/* Discount */}
        <div className="absolute top-4 left-4">
          <span className="display text-3xl md:text-4xl text-ink drop-shadow-[0_2px_10px_oklch(1_0_0/0.6)]">
            -{pct}%
          </span>
        </div>
        {/* Verdict */}
        <div className="absolute top-4 right-4">
          <VerdictBadge verdict={d.verdict} />
        </div>
        {/* Store chip */}
        <div className="absolute bottom-4 left-4 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[11px] text-ink-soft ring-1 ring-line">
          {d.store}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col flex-1 p-6">
        <div className="text-[11px] tracking-[0.22em] uppercase text-ink-muted">
          {d.category}
        </div>
        <h3 className="mt-2 display text-2xl text-ink leading-tight text-balance">
          {d.name}
        </h3>

        {/* AI insight */}
        <p className="mt-4 text-[13px] text-ink-soft leading-relaxed">
          {d.insight}
        </p>

        {/* Sparkline */}
        <div className={`mt-5 ${s.text}`}>
          <Sparkline data={d.history} width={260} height={44} fill />
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-line flex items-end justify-between">
          <div>
            <div className="display text-2xl text-ink">{money(d.price)}</div>
            <div className="mt-0.5 text-[12px] text-ink-muted line-through">
              {money(d.original)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
                AI score
              </div>
              <div className="text-[13px] text-ink font-medium">
                {d.score}/100
              </div>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-line text-ink-soft group-hover:text-background group-hover:bg-ink group-hover:ring-ink transition-all">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ============================================================
   Buy Now or Wait
============================================================ */

function BuyOrWait() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-12 flex-wrap">
          <div>
            <div className="eyebrow">Buy now · or wait</div>
            <h2 className="display mt-4 text-4xl md:text-6xl text-balance">
              Should you buy today,
              <br />
              <span className="text-ink-soft font-normal">or hold on?</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] text-ink-muted">
            Every deal is scored against 12 months of history, upcoming sales,
            and bank offer cycles. Three products, three verdicts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {buyOrWait.map((b, i) => {
            const isBuy = b.action === "Buy Now";
            return (
              <div
                key={b.id}
                className={`relative rounded-[28px] p-8 flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                  isBuy
                    ? "bg-ink text-background"
                    : "bg-surface ring-1 ring-line"
                }`}
              >
                {/* Ambient wash */}
                {isBuy && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-40"
                    style={{
                      background:
                        "radial-gradient(closest-side, oklch(0.72 0.17 55 / 0.7), transparent 70%)",
                    }}
                  />
                )}

                <div className="relative flex items-center justify-between">
                  <span
                    className={`text-[11px] tracking-[0.22em] uppercase ${
                      isBuy ? "text-background/60" : "text-ink-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} · Recommendation
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ${
                      isBuy
                        ? "bg-accent text-background"
                        : "bg-[oklch(0.72_0.14_75)]/12 text-[oklch(0.42_0.12_75)] ring-1 ring-[oklch(0.72_0.14_75)]/25"
                    }`}
                  >
                    {isBuy ? <Check size={12} /> : <Clock size={12} />}
                    {b.action}
                  </span>
                </div>

                <div className="relative mt-8 aspect-[5/4] rounded-2xl overflow-hidden bg-[oklch(0.96_0.02_60)]">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="absolute inset-0 h-full w-full object-contain p-8"
                  />
                </div>

                <h3
                  className={`display mt-6 text-2xl md:text-3xl text-balance ${
                    isBuy ? "text-background" : "text-ink"
                  }`}
                >
                  {b.name}
                </h3>

                <p
                  className={`mt-3 text-[13px] leading-relaxed ${
                    isBuy ? "text-background/75" : "text-ink-soft"
                  }`}
                >
                  {b.reason}
                </p>

                <div
                  className={`mt-6 grid grid-cols-2 gap-4 pt-5 border-t ${
                    isBuy ? "border-background/15" : "border-line"
                  }`}
                >
                  <div>
                    <div
                      className={`text-[10px] tracking-[0.22em] uppercase ${
                        isBuy ? "text-background/55" : "text-ink-muted"
                      }`}
                    >
                      Current
                    </div>
                    <div
                      className={`mt-1 display text-xl ${
                        isBuy ? "text-background" : "text-ink"
                      }`}
                    >
                      {money(b.current)}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-[10px] tracking-[0.22em] uppercase ${
                        isBuy ? "text-background/55" : "text-ink-muted"
                      }`}
                    >
                      Expected
                    </div>
                    <div
                      className={`mt-1 display text-xl flex items-center gap-1 ${
                        isBuy ? "text-background" : "text-ink"
                      }`}
                    >
                      {money(b.expected)}
                      {isBuy ? (
                        <TrendingUp
                          size={13}
                          className="text-background/60"
                        />
                      ) : (
                        <TrendingDown size={13} className="text-accent" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-6">
                  <div
                    className={`flex items-center justify-between text-[11px] mb-2 ${
                      isBuy ? "text-background/60" : "text-ink-muted"
                    }`}
                  >
                    <span>Confidence</span>
                    <span
                      className={isBuy ? "text-background" : "text-ink"}
                    >
                      {b.confidence}%
                    </span>
                  </div>
                  <div
                    className={`h-1 rounded-full overflow-hidden ${
                      isBuy ? "bg-background/15" : "bg-line"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isBuy ? "bg-accent" : "bg-ink"
                      }`}
                      style={{ width: `${b.confidence}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`mt-5 text-[12px] flex items-center gap-2 ${
                    isBuy ? "text-background/70" : "text-ink-soft"
                  }`}
                >
                  <Clock size={12} />
                  {b.event}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Trending Today — magazine layout
============================================================ */

function TrendingToday() {
  const [main, ...rest] = trending;
  return (
    <section className="relative py-24 md:py-36 bg-surface-2/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-14 flex-wrap">
          <div>
            <div className="eyebrow">Trending today</div>
            <h2 className="display mt-4 text-4xl md:text-6xl text-balance">
              What everyone is
              <br />
              <span className="text-ink-soft font-normal">
                watching this hour.
              </span>
            </h2>
          </div>
          <Link
            to="/"
            className="text-[13px] text-ink-soft hover:text-ink link-underline"
          >
            See the full list →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Feature */}
          <a
            href="#"
            className="group lg:col-span-7 relative rounded-[32px] overflow-hidden bg-surface ring-1 ring-line aspect-[4/3] lg:aspect-auto lg:min-h-[560px]"
          >
            <img
              src={main.image}
              alt={main.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="rounded-full bg-background/85 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-ink">
                #1 · {main.cat}
              </span>
            </div>
            <div className="absolute top-6 right-6 rounded-full bg-accent text-background px-3 py-1.5 text-[11px] font-semibold">
              {main.drop}
            </div>
            <div className="absolute bottom-8 left-8 right-8 text-background">
              <div className="text-[11px] tracking-[0.22em] uppercase opacity-80">
                Cover story
              </div>
              <h3
                className="display mt-3 text-balance"
                style={{
                  fontSize: "clamp(36px, 5vw, 64px)",
                  lineHeight: 0.98,
                }}
              >
                {main.name}
              </h3>
              <div className="mt-4 flex items-center gap-3 text-[13px] opacity-90">
                <span>Read the AI take</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </a>

          {/* Supporting cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {rest.map((r, i) => (
              <a
                key={r.name}
                href="#"
                className="group relative rounded-[24px] overflow-hidden bg-surface ring-1 ring-line flex items-stretch"
              >
                <div className="relative w-2/5 min-h-[160px] overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-ink-muted">
                      <span>#{i + 2}</span>
                      <span className="text-accent font-semibold not-italic">
                        {r.drop}
                      </span>
                    </div>
                    <h4 className="display text-xl mt-2 text-ink leading-tight text-balance">
                      {r.name}
                    </h4>
                    <div className="text-[12px] text-ink-muted mt-1">
                      {r.cat}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12px] text-ink-soft link-underline">
                      See deal
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-line text-ink-soft group-hover:text-background group-hover:bg-ink group-hover:ring-ink transition-all">
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Closing note
============================================================ */

function ClosingNote() {
  return (
    <section className="relative py-32 md:py-48">
      <div className="mx-auto max-w-4xl px-6 md:px-10 text-center">
        <div className="eyebrow inline-flex items-center gap-2">
          <Sparkles size={12} className="text-accent" />
          One more thing
        </div>
        <h2
          className="display mt-6 text-ink text-balance"
          style={{
            fontSize: "clamp(40px, 7vw, 96px)",
            lineHeight: 0.96,
            letterSpacing: "-0.045em",
          }}
        >
          Every deal here
          <br />
          <span className="text-ink-soft font-normal">was worth a second look.</span>
        </h2>
        <p className="mt-8 text-[16px] md:text-[18px] text-ink-soft leading-relaxed max-w-xl mx-auto">
          Not curated by the store. Not surfaced by ads. Chosen by an AI whose
          only job is to tell you when the price is finally right.
        </p>
        <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
          <button className="inline-flex items-center gap-2 h-12 pl-5 pr-4 rounded-full bg-ink text-background text-[14px] font-medium magnetic hover:bg-ink/90">
            Track your first product
            <span className="grid h-8 w-8 place-items-center rounded-full bg-background/15">
              <ArrowUpRight size={14} />
            </span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-full ring-1 ring-line text-ink text-[14px] font-medium hover:ring-ink/40 transition-all"
          >
            Explore PricePilot
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Page
============================================================ */

function DealsPage() {
  return (
    <div className="relative min-h-screen bg-background text-ink overflow-x-hidden">
      <DealsNav />
      <Hero />
      <LiveTicker />
      <FeaturedDeal />
      <HotDeals />
      <BuyOrWait />
      <TrendingToday />
      <ClosingNote />

      <footer className="border-t border-line py-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-ink-muted">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-background text-[10px] font-semibold">
              P
            </span>
            PricePilot · Shop smarter with AI
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ink transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Terms
            </a>
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
