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

const suggestions = [
  { label: "Gaming Laptop", meta: "₹90k" },
  { label: "Mirrorless Camera", meta: "Beginner" },
  { label: "Mechanical Keyboard", meta: "Coding" },
];

// Deterministic dust particle positions (avoid SSR mismatch)
const dust = Array.from({ length: 22 }, (_, i) => {
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9973.13) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: rand(i + 1) * 100,
    top: rand(i + 7) * 100,
    delay: rand(i + 13) * 8,
    duration: 10 + rand(i + 19) * 10,
    size: 1 + Math.floor(rand(i + 23) * 2),
    opacity: 0.15 + rand(i + 29) * 0.25,
  };
});

function Hero() {
  const [idx, setIdx] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % placeholders.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setParallax({ x, y }));
    };
    const onLeave = () => setParallax({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const px = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
    transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1)",
  });

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-32 md:pt-36 pb-24">
      {/* Ambient warm light — barely there */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[68%] top-[42%] -translate-x-1/2 -translate-y-1/2 h-[1100px] w-[1100px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.965 0.025 65 / 0.85), transparent 72%)",
          }}
        />
      </div>

      {/* Dust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dust.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ink"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              opacity: d.opacity,
              animation: `dust-drift ${d.duration}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full mx-auto grid max-w-[1520px] grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-16 px-8 md:px-16">
        {/* LEFT — Editorial column */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Tiny editorial marker */}
          <div
            className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-ink-muted anim-reveal"
            style={{ animationDelay: "0ms" }}
          >
            <span className="text-ink-soft/60 font-medium">N° 001</span>
            <span className="h-px w-8 bg-ink-muted/40" />
            <span>The AI Shopping Copilot</span>
          </div>

          <h1
            className="display mt-14 text-[64px] sm:text-[88px] lg:text-[104px] xl:text-[112px] leading-[0.88] tracking-[-0.05em] text-ink anim-reveal"
            style={{ animationDelay: "120ms", fontWeight: 700 }}
          >
            Every Product.
            <br />
            One Decision.
          </h1>

          <p
            className="mt-14 max-w-md text-[17px] leading-[1.55] text-ink-soft anim-reveal"
            style={{ animationDelay: "260ms" }}
          >
            Compare products, prices and reviews across every major store
            before you buy.
          </p>

          {/* Premium AI search */}
          <div
            className="mt-16 group relative anim-reveal"
            style={{ animationDelay: "360ms" }}
          >
            {/* focus glow */}
            <div className="pointer-events-none absolute -inset-3 rounded-[32px] bg-[oklch(0.94_0.03_65)] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-70 group-focus-within:opacity-100" />

            <div className="relative flex items-center gap-4 h-[76px] rounded-[26px] border border-line/80 bg-surface/95 backdrop-blur-sm pl-7 pr-2.5 transition-all duration-500 group-hover:border-ink/30"
              style={{ boxShadow: "0 1px 0 oklch(1 0 0), 0 30px 60px -40px oklch(0.2 0.02 60 / 0.2)" }}
            >
              <Search size={22} className="text-ink-muted shrink-0 transition-colors duration-500 group-focus-within:text-ink" strokeWidth={1.5} />
              <div className="relative flex-1 h-full flex items-center overflow-hidden">
                <span
                  key={idx}
                  className="pointer-events-none text-[18px] text-ink-soft/80 anim-reveal"
                >
                  {placeholders[idx]}
                </span>
                <span className="ml-1 inline-block h-[22px] w-[1.5px] bg-ink-soft/70 anim-caret" />
              </div>
              <button className="group/btn inline-flex items-center gap-2 h-[60px] pl-6 pr-5 rounded-[20px] bg-ink text-background text-[14px] font-medium hover:bg-ink/90 transition-all duration-300">
                Ask AI
                <span className="grid h-6 w-6 place-items-center rounded-full bg-background/10 transition-transform duration-500 group-hover/btn:translate-x-0.5">
                  <ArrowRight size={13} strokeWidth={2} />
                </span>
              </button>
            </div>

            {/* Premium example suggestions */}
            <div className="mt-10 space-y-1">
              {suggestions.map((s, i) => (
                <button
                  key={s.label}
                  className="group/row w-full flex items-center gap-4 py-2.5 text-left anim-reveal"
                  style={{ animationDelay: `${520 + i * 120}ms` }}
                >
                  <span className="text-[11px] tracking-widest text-ink-muted/70 w-8">
                    0{i + 1}
                  </span>
                  <span className="text-[15px] text-ink-soft group-hover/row:text-ink transition-colors">
                    {s.label}
                  </span>
                  <span className="flex-1 relative h-px bg-ink-muted/15 overflow-hidden">
                    <span className="absolute inset-y-0 left-0 w-0 bg-ink group-hover/row:w-full transition-all duration-700" />
                  </span>
                  <span className="text-[13px] text-ink-muted group-hover/row:text-ink-soft transition-colors">
                    {s.meta}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-ink-muted opacity-0 -translate-x-1 group-hover/row:opacity-100 group-hover/row:translate-x-0 transition-all duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Product installation */}
        <div
          ref={stageRef}
          className="lg:col-span-6 relative min-h-[640px] lg:min-h-[820px]"
        >
          {/* Editorial index numeral */}
          <div className="pointer-events-none absolute right-2 top-4 z-30 flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-ink-muted/60">
            <span className="hairline w-10" />
            <span>Composition / 01</span>
          </div>

          {/* Backdrop disc — anchors the composition */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[620px] w-[620px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.985 0.012 70 / 1), oklch(0.965 0.02 65 / 0.6) 55%, transparent 78%)",
            }}
          />
          {/* Thin ring — subtle editorial frame */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full border"
            style={{ borderColor: "oklch(0.2 0.02 60 / 0.06)" }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[720px] w-[720px] rounded-full border"
            style={{ borderColor: "oklch(0.2 0.02 60 / 0.035)" }}
          />

          {/* Ambient key light */}
          <div
            className="pointer-events-none absolute left-[46%] top-[38%] -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(1 0.02 75 / 0.85), transparent 72%)",
            }}
          />

          {/* Layered ground shadows for depth */}
          <div
            className="absolute left-1/2 bottom-[14%] -translate-x-1/2 h-[42px] w-[520px] rounded-[50%] blur-3xl"
            style={{ background: "oklch(0.2 0.02 60 / 0.22)" }}
          />
          <div
            className="absolute left-1/2 bottom-[16%] -translate-x-1/2 h-[24px] w-[360px] rounded-[50%] blur-xl"
            style={{ background: "oklch(0.2 0.02 60 / 0.18)" }}
          />

          {/* Headphones — foreground anchor, bottom-left */}
          <img
            src={heroHeadphones}
            alt="Headphones"
            width={768}
            height={768}
            loading="lazy"
            className="absolute left-[2%] bottom-[8%] w-[240px] md:w-[300px] anim-float will-change-transform z-20"
            style={{
              ...px(26),
              transform: `translate3d(${parallax.x * 26}px, ${parallax.y * 26}px, 0) rotate(-8deg)`,
              filter:
                "drop-shadow(0 50px 40px rgba(60,40,20,0.22)) drop-shadow(0 18px 18px rgba(60,40,20,0.10))",
            }}
          />

          {/* Laptop — hero centerpiece */}
          <img
            src={heroLaptop}
            alt="Laptop"
            width={1024}
            height={768}
            className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[100%] max-w-[600px] anim-float will-change-transform z-10"
            style={{
              ...px(12),
              filter:
                "drop-shadow(0 70px 55px rgba(60,40,20,0.18)) drop-shadow(0 22px 22px rgba(60,40,20,0.08))",
            }}
          />

          {/* Phone — upper right, overlapping laptop for depth */}
          <img
            src={heroPhone}
            alt="Phone"
            width={640}
            height={896}
            loading="lazy"
            className="absolute right-[8%] top-[6%] w-[170px] md:w-[210px] anim-float-slow will-change-transform z-20"
            style={{
              ...px(22),
              transform: `translate3d(${parallax.x * 22}px, ${parallax.y * 22}px, 0) rotate(9deg)`,
              filter:
                "drop-shadow(0 50px 45px rgba(60,40,20,0.22)) drop-shadow(0 18px 18px rgba(60,40,20,0.10))",
            }}
          />

          {/* Floating price tag — top left */}
          <div
            className="absolute left-[4%] top-[14%] z-30 anim-float-slow will-change-transform"
            style={{
              ...px(30),
              transform: `translate3d(${parallax.x * 30}px, ${parallax.y * 30}px, 0)`,
            }}
          >
            <div className="rounded-2xl bg-surface/95 backdrop-blur-md border border-ink/8 shadow-[0_20px_50px_-20px_rgba(60,40,20,0.25)] px-4 py-3 min-w-[190px]">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-ink-muted/70">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Live price
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[22px] font-semibold tracking-tight text-ink tabular-nums">
                  ₹72,999
                </span>
                <span className="text-[11px] font-medium text-accent tabular-nums">
                  ↓ ₹6,000
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-ink-muted">
                Flipkart · lowest in 90 days
              </div>
            </div>
          </div>

          {/* AI verdict chip — bottom right */}
          <div
            className="absolute right-[4%] bottom-[18%] z-30 anim-float will-change-transform"
            style={{
              ...px(18),
              transform: `translate3d(${parallax.x * 18}px, ${parallax.y * 18}px, 0)`,
            }}
          >
            <div className="rounded-full bg-ink text-surface px-4 py-2.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.4)] flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-[12px] tracking-[0.02em] font-medium">
                AI verdict · Buy now
              </span>
            </div>
          </div>

          {/* Metric badge — mid right */}
          <div
            className="absolute right-[2%] top-[46%] z-30 anim-float-slow will-change-transform hidden md:block"
            style={{
              ...px(14),
              transform: `translate3d(${parallax.x * 14}px, ${parallax.y * 14}px, 0)`,
            }}
          >
            <div className="rounded-xl bg-surface/90 backdrop-blur-md border border-ink/8 px-3 py-2 shadow-[0_10px_30px_-12px_rgba(60,40,20,0.2)]">
              <div className="text-[9px] tracking-[0.3em] uppercase text-ink-muted/70">
                Score
              </div>
              <div className="text-[18px] font-semibold text-ink tabular-nums leading-none mt-1">
                9.4<span className="text-ink-muted/50 text-[12px]">/10</span>
              </div>
            </div>
          </div>

          {/* Hairline connectors — editorial detail */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full z-0"
            aria-hidden
          >
            <line
              x1="16%" y1="22%" x2="34%" y2="40%"
              stroke="oklch(0.2 0.02 60 / 0.12)" strokeWidth="1" strokeDasharray="2 4"
            />
            <line
              x1="88%" y1="18%" x2="70%" y2="34%"
              stroke="oklch(0.2 0.02 60 / 0.12)" strokeWidth="1" strokeDasharray="2 4"
            />
          </svg>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-ink-muted/70">
          Scroll
        </span>
        <span className="relative block h-14 w-px bg-ink-muted/20 overflow-hidden">
          <span
            className="absolute left-1/2 -translate-x-1/2 top-0 h-3 w-px bg-ink"
            style={{ animation: "scroll-line 2.4s cubic-bezier(0.7,0,0.3,1) infinite" }}
          />
        </span>
      </div>

      <style>{`
        @keyframes dust-drift {
          0%, 100% { transform: translate(0, 0); opacity: var(--tw-opacity, 0.2); }
          50%      { transform: translate(6px, -14px); }
        }
        @keyframes scroll-line {
          0%   { transform: translate(-50%, -100%); }
          60%  { transform: translate(-50%, 400%); }
          100% { transform: translate(-50%, 400%); opacity: 0; }
        }
      `}</style>
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
    <section className="bg-background py-10 border-t border-line/60">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="flex items-center gap-10 opacity-55">
          <span className="text-[10px] tracking-[0.28em] uppercase text-ink-muted shrink-0 hidden md:inline max-w-[160px] leading-relaxed">
            Trusted by thousands
            <br />of smart shoppers
          </span>
          <div className="hairline hidden md:block max-w-[48px]" />
          <div className="relative flex-1 overflow-hidden mask-fade">
            <div className="flex w-max anim-marquee gap-14">
              {row.map((s, i) => (
                <span
                  key={i}
                  className="text-[15px] font-medium tracking-tight text-ink-soft whitespace-nowrap"
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


/* ---------- Footer — The final interaction ---------- */

const FOOTER_PLACEHOLDERS = [
  "Gaming laptop under ₹90,000",
  "Best phone for photography",
  "Monitor for programming",
  "Mechanical keyboard",
  "Noise cancelling headphones",
];

const FOOTER_STATUS = [
  "Finding the best gaming laptops",
  "Comparing prices across 40+ stores",
  "Reading 12,480 reviews",
  "Checking 90-day price history",
  "Finding today's best deal",
];

function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const [phIdx, setPhIdx] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setSpot({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
        active: true,
      });
    };
    const onLeave = () => setSpot((s) => ({ ...s, active: false }));
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const a = setInterval(
      () => setPhIdx((i) => (i + 1) % FOOTER_PLACEHOLDERS.length),
      3200,
    );
    const b = setInterval(
      () => setStatusIdx((i) => (i + 1) % FOOTER_STATUS.length),
      2400,
    );
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  // Deterministic drifting particles
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const s = Math.sin(i * 12.9898) * 43758.5453;
        const r = (n: number) => {
          const v = Math.sin(s + n) * 43758.5453;
          return v - Math.floor(v);
        };
        return {
          left: r(1) * 100,
          top: 10 + r(2) * 80,
          size: 1 + r(3) * 2,
          delay: r(4) * 8,
          duration: 14 + r(5) * 12,
          opacity: 0.1 + r(6) * 0.25,
        };
      }),
    [],
  );

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "oklch(0.985 0.008 75)" }}
    >
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(500px circle at ${spot.x}% ${spot.y}%, oklch(1 0.02 75 / 0.9), transparent 60%)`,
        }}
      />

      {/* Top hairline fade — soft transition from previous section */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.98 0.008 75), transparent)",
        }}
      />

      {/* Drifting particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ink"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `footer-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main stage */}
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 pt-40 md:pt-56 pb-24">
        {/* AI status — tiny animated line above headline */}
        <div className="flex items-center justify-center gap-2.5 text-[11px] tracking-[0.28em] uppercase text-ink-muted/70 h-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span
            key={statusIdx}
            className="anim-fade-up"
            style={{ animation: "footer-fade 0.7s ease-out" }}
          >
            {FOOTER_STATUS[statusIdx]}…
          </span>
        </div>

        {/* Massive editorial headline */}
        <h2
          className="display mt-10 text-center text-ink font-medium"
          style={{
            fontSize: "clamp(56px, 11vw, 128px)",
            lineHeight: 0.95,
            letterSpacing: "-0.045em",
          }}
        >
          One last search.
        </h2>

        <p className="mt-8 text-center text-ink-muted text-[15px] max-w-xl mx-auto leading-relaxed">
          The AI is listening. Describe what you're looking for and we'll do
          the rest.
        </p>

        {/* Giant search — the hero of the footer */}
        <div
          className="relative mx-auto mt-14 w-full"
          style={{ maxWidth: 960 }}
        >
          {/* Ambient glow behind search */}
          <div
            className="pointer-events-none absolute -inset-10 rounded-[48px] transition-opacity duration-700"
            style={{
              opacity: focused ? 1 : 0.55,
              background:
                "radial-gradient(closest-side, oklch(1 0.03 75 / 0.9), transparent 70%)",
            }}
          />
          <label
            className="relative flex items-center gap-4 rounded-full bg-surface/95 backdrop-blur-md border transition-all duration-500"
            style={{
              height: 76,
              paddingLeft: 28,
              paddingRight: 8,
              borderColor: focused
                ? "oklch(0.68 0.17 45 / 0.5)"
                : "oklch(0.2 0.02 60 / 0.1)",
              boxShadow: focused
                ? "0 40px 80px -30px oklch(0.68 0.17 45 / 0.35), 0 0 0 6px oklch(0.68 0.17 45 / 0.06)"
                : "0 30px 60px -30px rgba(60,40,20,0.2)",
            }}
          >
            <Search size={20} className="text-ink-muted shrink-0" />
            <div className="relative flex-1 h-full">
              <input
                type="text"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=""
                className="peer absolute inset-0 w-full h-full bg-transparent outline-none text-[17px] text-ink placeholder:text-transparent"
              />
              <span
                key={phIdx}
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[17px] text-ink-muted peer-focus:opacity-0 transition-opacity duration-300"
                style={{ animation: "footer-fade 0.6s ease-out" }}
              >
                {FOOTER_PLACEHOLDERS[phIdx]}
              </span>
            </div>
            <button
              type="button"
              className="group h-[60px] px-6 rounded-full bg-ink text-surface flex items-center gap-2.5 text-[14px] font-medium tracking-tight transition-transform duration-300 hover:scale-[1.02]"
            >
              Ask AI
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </label>
        </div>
      </div>

      {/* Very bottom — minimal signature */}
      <div className="relative">
        <div
          className="mx-auto max-w-[1200px] h-px"
          style={{ background: "oklch(0.2 0.02 60 / 0.08)" }}
        />
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-ink-muted">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-surface text-[9px] font-semibold">
              P
            </span>
            <span className="tracking-tight">PricePilot</span>
            <span className="opacity-40">·</span>
            <span className="opacity-70">© 2026</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms</a>
            <a href="#" className="hover:text-ink transition-colors">Contact</a>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes footer-drift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(8px, -18px); }
        }
        @keyframes footer-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
        
      </main>
      <Footer />
    </div>
  );
}
