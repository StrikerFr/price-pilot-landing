import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteNav, CommandPalette } from "@/components/site/SiteNav";


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
import salePrimeDay from "@/assets/sale-primeday.jpg";
import saleGIF from "@/assets/sale-gif.jpg";
import saleBBD from "@/assets/sale-bbd.jpg";
import saleBlackFriday from "@/assets/sale-blackfriday.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PricePilot — AI Shopping Copilot for India" },
      {
        name: "description",
        content:
          "Ask, don't scroll. PricePilot is the AI shopping copilot that recommends, compares prices across every store, and tells you when to buy — grounded in live retrieved data.",
      },
      { property: "og:title", content: "PricePilot — AI Shopping Copilot for India" },
      {
        property: "og:description",
        content:
          "One conversation. Every store. The smartest buying decision — grounded in live retrieved data.",
      },
      { property: "og:url", content: "https://price-pilot-landing.lovable.app/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://price-pilot-landing.lovable.app/" }],
  }),
  component: LandingPage,
});


/* ---------- Nav ---------- */

import { NAV_ITEMS } from "@/lib/nav";

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
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-background text-[10px] font-semibold">
            P
          </span>
          <span className="display text-lg tracking-tight">PricePilot</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="link-underline px-3 py-2 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>


        <div className="flex items-center gap-1">
          <button className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2 transition-colors">
            <Search size={17} strokeWidth={1.6} />
          </button>
          <Link to="/wishlist" className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2 transition-colors">
            <Heart size={17} strokeWidth={1.6} />
          </Link>
          <Link
            to="/ai-assistant"
            className="hidden md:inline-flex items-center px-3 h-9 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Ask AI
          </Link>
          <Link to="/profile" className="inline-flex items-center gap-1.5 h-9 pl-3 pr-2 rounded-full bg-ink text-background text-[13px] font-medium magnetic hover:bg-ink/90">
            Profile
            <span className="grid h-6 w-6 place-items-center rounded-full bg-background/15">
              <User size={13} strokeWidth={1.8} />
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

/* ---------- Hero data ---------- */

type Scene = {
  query: string;
  match: string;
  score: string;
  price: string;
  shape: keyof typeof SHAPES;
};

const scenes: Scene[] = [
  { query: "Gaming laptop under ₹90k",       match: "ASUS TUF A15 Ryzen 7",   score: "9.2", price: "₹86,499",   shape: "laptop" },
  { query: "Mechanical keyboard for coding", match: "Keychron K2 Pro",        score: "9.1", price: "₹12,499",   shape: "keyboard" },
  { query: "Best phone camera",              match: "iPhone 15 Pro",          score: "9.5", price: "₹1,19,900", shape: "phone" },
  { query: "OLED monitor",                   match: "LG 27\" UltraGear OLED", score: "9.3", price: "₹79,999",   shape: "monitor" },
  { query: "Wireless headphones",            match: "Sony WH-1000XM5",        score: "9.6", price: "₹24,990",   shape: "headphones" },
];

const thinkingSteps = [
  "Searching the index",
  "Reading 12,481 reviews",
  "Comparing 41 retailers",
  "Weighing tradeoffs",
  "Assembling recommendation",
];

/* ---------- Shape point clouds (normalized to a 100x100 stage) ---------- */

type Pt = { x: number; y: number };

const gridPts = (cols: number, rows: number, cx: number, cy: number, w: number, h: number): Pt[] => {
  const pts: Pt[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cx + (cols === 1 ? 0 : (c / (cols - 1) - 0.5) * w);
      const y = cy + (rows === 1 ? 0 : (r / (rows - 1) - 0.5) * h);
      pts.push({ x, y });
    }
  }
  return pts;
};

// Elegant idle formation — golden-angle spiral so panels feel organized, not random
const IDLE_PTS: Pt[] = Array.from({ length: 54 }, (_, i) => {
  const a = i * 137.508 * (Math.PI / 180);
  const r = Math.sqrt((i + 1) / 54) * 34;
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r * 0.85 };
});

const SHAPES = {
  idle: IDLE_PTS,
  laptop: [
    ...gridPts(9, 4, 50, 38, 46, 22),   // screen
    ...gridPts(11, 1, 50, 52, 52, 0),   // hinge
    ...gridPts(10, 2, 50, 58, 48, 4),   // base
  ],
  phone: gridPts(3, 8, 50, 50, 14, 46),
  headphones: (() => {
    const pts: Pt[] = [];
    for (let i = 0; i < 13; i++) {
      const t = i / 12;
      pts.push({ x: 28 + t * 44, y: 32 - Math.sin(t * Math.PI) * 12 });
    }
    pts.push(...gridPts(2, 4, 28, 56, 8, 18));
    pts.push(...gridPts(2, 4, 72, 56, 8, 18));
    return pts;
  })(),
  monitor: [
    ...gridPts(9, 5, 50, 40, 52, 28),   // panel
    ...gridPts(2, 2, 50, 60, 5, 4),     // neck
    ...gridPts(7, 1, 50, 66, 22, 0),    // stand base
  ],
  keyboard: gridPts(11, 3, 50, 50, 56, 16),
} as const;

const TOTAL_PANELS = 54;

// Deterministic per-panel character (aspect, tiny drift phase). Position comes from active shape.
const panelChars = Array.from({ length: TOTAL_PANELS }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin((i + 1) * n) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    ratio: 0.66 + r(5.77) * 0.18,      // slightly varied aspect
    delay: r(3.14) * 8,
    driftDur: 10 + r(2.71) * 8,
    zJitter: (r(9.13) - 0.5) * 40,     // small Z variation
    tilt: (r(19.19) - 0.5) * 6,        // very subtle tilt
  };
});

// Back-wall archive grid — organized cabinet of tiny panels for depth
const BACK_WALL: Pt[] = gridPts(9, 5, 50, 50, 92, 78);

/** Typewriter that types → holds → deletes, then advances. */
function useTypewriter(text: string, onComplete: () => void) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const completedRef = useRef(false);

  useEffect(() => {
    setDisplay("");
    setPhase("typing");
    completedRef.current = false;
  }, [text]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (display.length < text.length) {
        t = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 55 + Math.random() * 40);
      } else {
        t = setTimeout(() => setPhase("holding"), 2600);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), 2000);
    } else {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), 22);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }
    return () => clearTimeout(t);
  }, [display, phase, text, onComplete]);

  return { display, phase };
}

const dust = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin((i + 1) * n) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    left: r(9973.13) * 100,
    top: r(1237.7) * 100,
    delay: r(577.7) * 12,
    duration: 18 + r(311.1) * 14,
    size: 1 + Math.floor(r(41.7) * 2),
    opacity: 0.06 + r(83.1) * 0.14,
  };
});

function Hero() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [thinkIdx, setThinkIdx] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showShape, setShowShape] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [light, setLight] = useState({ x: 55, y: 40 });
  const navigate = useNavigate();

  const scene = scenes[sceneIdx];
  const isTypingUser = focused || query.length > 0;

  const advanceScene = () => setSceneIdx((i) => (i + 1) % scenes.length);
  const { display: typed, phase } = useTypewriter(scene.query, advanceScene);

  useEffect(() => {
    if (isTypingUser) { setShowCard(false); setShowShape(false); return; }
    if (phase !== "holding") { setShowCard(false); setShowShape(false); return; }
    setThinkIdx(0);
    setShowCard(false);
    setShowShape(false);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i >= thinkingSteps.length) {
        clearInterval(t);
        setShowShape(true);
        setTimeout(() => setShowCard(true), 550);
      } else {
        setThinkIdx(i);
      }
    }, 340);
    return () => clearInterval(t);
  }, [phase, sceneIdx, isTypingUser]);

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate({ to: "/ai-assistant", search: { q: trimmed } });
  };

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setParallax({ x: nx - 0.5, y: ny - 0.5 });
        setLight({ x: nx * 100, y: ny * 100 });
      });
    };
    const onLeave = () => { setParallax({ x: 0, y: 0 }); setLight({ x: 55, y: 40 }); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  const activeShape: Pt[] = (isTypingUser || !showShape) ? SHAPES.idle : (SHAPES[scene.shape] as unknown as Pt[]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-screen flex items-center pt-32 md:pt-36 pb-24"
      style={{ background: "oklch(0.985 0.005 85)" }}
    >
      {/* Gallery lighting */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-[1600ms] ease-out"
        style={{ background: `radial-gradient(1200px 820px at ${light.x}% ${light.y}%, oklch(1 0.01 80 / 0.95), transparent 65%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1400px 900px at 82% 22%, oklch(0.98 0.028 68 / 0.6), transparent 62%), radial-gradient(900px 700px at 10% 92%, oklch(0.965 0.02 60 / 0.4), transparent 65%)",
        }}
      />
      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: "radial-gradient(oklch(0.15 0.02 60) 1px, transparent 1px)", backgroundSize: "3px 3px" }}
      />
      {/* Floating dust */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dust.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ink"
            style={{
              left: `${d.left}%`, top: `${d.top}%`,
              width: `${d.size}px`, height: `${d.size}px`,
              opacity: d.opacity,
              animation: `hero-dust ${d.duration}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full mx-auto grid max-w-[1520px] grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 px-5 sm:px-8 md:px-16">
        {/* LEFT — editorial + search */}
        <div className="lg:col-span-5 flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-ink-muted anim-reveal" style={{ animationDelay: "0ms" }}>
            <span className="text-ink-soft/60 font-medium">N° 001</span>
            <span className="h-px w-8 bg-ink-muted/40" />
            <span>An AI, thinking out loud</span>
          </div>

          <h1
            className="display mt-8 sm:mt-12 lg:mt-14 text-[46px] xs:text-[56px] sm:text-[76px] md:text-[92px] lg:text-[108px] xl:text-[120px] leading-[0.9] tracking-[-0.05em] text-ink text-balance"
            style={{ fontWeight: 700 }}
          >
            <span className="block overflow-hidden"><span className="block anim-rise" style={{ animationDelay: "80ms" }}>An index</span></span>
            <span className="block overflow-hidden"><span className="block anim-rise" style={{ animationDelay: "220ms" }}>of everything</span></span>
            <span className="block overflow-hidden mt-1">
              <span className="block anim-rise italic font-light" style={{ animationDelay: "380ms", fontFamily: "var(--font-display)" }}>
                worth buying.
              </span>
            </span>
          </h1>

          <p className="mt-8 sm:mt-12 lg:mt-14 max-w-md text-[15px] sm:text-[17px] leading-[1.55] text-ink-soft anim-reveal" style={{ animationDelay: "700ms" }}>
            Every product, price and review — continuously reorganized by an AI that only tells you what to buy.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); submit(query || scene.query); }}
            className="mt-10 sm:mt-14 lg:mt-16 group relative anim-reveal"
            style={{ animationDelay: "820ms" }}
          >
            <div
              className="pointer-events-none absolute -inset-6 rounded-[36px] opacity-60 blur-3xl transition-opacity duration-700"
              style={{ background: "radial-gradient(closest-side, oklch(0.94 0.05 65 / 0.9), transparent 70%)", animation: "halo-breathe 5.5s ease-in-out infinite" }}
            />
            <div
              className="relative flex items-center gap-2 sm:gap-4 h-[64px] sm:h-[76px] rounded-[22px] sm:rounded-[26px] border border-line/80 bg-surface/95 backdrop-blur-sm pl-4 sm:pl-7 pr-2 sm:pr-2.5 transition-all duration-500 group-hover:border-ink/30 group-focus-within:border-ink/40"
              style={{ boxShadow: "0 1px 0 oklch(1 0 0), 0 30px 60px -40px oklch(0.2 0.02 60 / 0.22)" }}
            >
              <Search size={20} className="text-ink-muted shrink-0 transition-colors duration-500 group-focus-within:text-ink" strokeWidth={1.5} />
              <div className="relative flex-1 min-w-0 h-full flex items-center overflow-hidden">
                <input
                  type="text"
                  value={query}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Ask PricePilot AI"
                  className="peer absolute inset-0 h-full w-full bg-transparent outline-none text-[15px] sm:text-[18px] text-ink placeholder:text-transparent"
                />
                {!isTypingUser && (
                  <div className="pointer-events-none flex items-center max-w-full overflow-hidden">
                    <span className="text-[15px] sm:text-[18px] text-ink-soft/90 truncate tabular-nums">{typed}</span>
                    <span className="ml-1 inline-block h-[18px] sm:h-[22px] w-[1.5px] bg-ink/70 anim-caret shrink-0" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                aria-label="Ask AI"
                className="group/btn shrink-0 inline-flex items-center gap-2 h-[48px] sm:h-[60px] px-4 sm:pl-6 sm:pr-5 rounded-[16px] sm:rounded-[20px] bg-ink text-background text-[13px] sm:text-[14px] font-medium hover:bg-ink/90 transition-all duration-300"
              >
                <span className="hidden sm:inline">Ask AI</span>
                <span className="sm:hidden">Ask</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-background/10 transition-transform duration-500 group-hover/btn:translate-x-0.5">
                  <ArrowRight size={13} strokeWidth={2} />
                </span>
              </button>
            </div>

            <div className="mt-5 h-5 flex items-center gap-2 text-[12px] tracking-[0.02em] text-ink-muted">
              {!isTypingUser && phase === "holding" && !showCard && (
                <span key={thinkIdx} className="flex items-center gap-2 anim-fade-slide">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span>{thinkingSteps[thinkIdx]}<span className="anim-dots" /></span>
                </span>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT — Cinematic panel installation */}
        <div
          ref={stageRef}
          className="lg:col-span-7 relative min-h-[540px] sm:min-h-[660px] md:min-h-[740px] lg:min-h-[820px]"
          style={{ perspective: "1800px", perspectiveOrigin: "50% 45%" }}
        >
          {/* Corpus label */}
          <div className="pointer-events-none absolute right-2 top-4 z-40 flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-ink-muted/60">
            <span className="hairline w-10" />
            <span>Corpus / {String(sceneIdx + 1).padStart(2, "0")}</span>
          </div>

          {/* Architectural floor — perspective grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              background:
                "linear-gradient(to right, oklch(0.15 0.02 60 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.15 0.02 60 / 0.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 70% 65% at 50% 55%, black 30%, transparent 78%)",
              transform: `perspective(900px) rotateX(58deg) translateY(28%) scale(1.4)`,
              transformOrigin: "50% 80%",
            }}
          />

          {/* Deep vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(closest-side, transparent 42%, oklch(0.94 0.012 70 / 0.55) 92%)" }}
          />

          {/* The 3D room */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${parallax.y * -3}deg) rotateY(${parallax.x * 5}deg)`,
              transition: "transform 1200ms cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            {/* BACK WALL — organized archive of tiny panels */}
            {BACK_WALL.map((p, i) => {
              const r = Math.sin((i + 1) * 12.9898) * 43758.5453;
              const jitter = (r - Math.floor(r) - 0.5) * 4;
              const nx = (p.x - light.x) / 100;
              const ny = (p.y - light.y) / 100;
              const shade = Math.max(0, Math.min(1, 0.55 - nx * 0.2 - ny * 0.12));
              return (
                <div
                  key={`bw-${i}`}
                  className="absolute"
                  style={{
                    left: `${p.x}%`, top: `${p.y}%`,
                    width: "26px", height: "18px",
                    marginLeft: "-13px", marginTop: "-9px",
                    transform: `translateZ(-320px) translateY(${jitter}px)`,
                    animation: `back-drift ${18 + (i % 5) * 2}s ease-in-out ${(i % 7) * 0.4}s infinite`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-[3px] border"
                    style={{
                      background: `linear-gradient(135deg, oklch(1 0.006 80 / ${0.7 + shade * 0.15}), oklch(0.94 0.014 68 / ${0.55 + shade * 0.15}))`,
                      borderColor: "oklch(0.2 0.02 60 / 0.06)",
                      boxShadow: `0 4px 10px -6px oklch(0.2 0.02 60 / 0.15)`,
                    }}
                  />
                </div>
              );
            })}

            {/* FOCAL PANELS — form the shape / spiral idle */}
            {panelChars.map((p, i) => {
              const target = activeShape[i % activeShape.length];
              const inShape = i < activeShape.length && showShape && !isTypingUser;
              const tx = target.x;
              const ty = target.y;
              const tz = inShape ? -30 + ((i % 5) - 2) * 8 : -60 + p.zJitter;

              // Panel size — larger and more consistent when in shape
              const w = inShape ? 44 : 40;
              const h = w * (inShape ? 0.72 : p.ratio);

              // Rotation — flat when in shape, subtle tilt when idle
              const rx = inShape ? 0 : p.tilt * 0.5;
              const ry = inShape ? 0 : p.tilt;
              const rz = inShape ? 0 : p.tilt * 0.3;

              const nx = (tx - light.x) / 100;
              const ny = (ty - light.y) / 100;
              const shade = Math.max(0, Math.min(1, 0.6 - nx * 0.25 - ny * 0.15));

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${tx}%`, top: `${ty}%`,
                    width: `${w}px`, height: `${h}px`,
                    marginLeft: `${-w / 2}px`, marginTop: `${-h / 2}px`,
                    transform: `translateZ(${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
                    transformStyle: "preserve-3d",
                    transition:
                      "left 1600ms cubic-bezier(0.22,1,0.36,1), top 1600ms cubic-bezier(0.22,1,0.36,1), width 900ms cubic-bezier(0.22,1,0.36,1), height 900ms cubic-bezier(0.22,1,0.36,1), transform 1400ms cubic-bezier(0.22,1,0.36,1)",
                    animation: `panel-breathe ${p.driftDur}s ease-in-out ${p.delay}s infinite`,
                    willChange: "transform, left, top",
                  }}
                >
                  <div
                    className="relative w-full h-full rounded-[8px] border overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, oklch(1 0.005 80 / ${0.96 + shade * 0.04}) 0%, oklch(0.96 0.014 65 / ${0.92 + shade * 0.06}) 100%)`,
                      borderColor: "oklch(0.2 0.02 60 / 0.09)",
                      boxShadow: `
                        0 ${10 + shade * 8}px ${24 + shade * 18}px -12px oklch(0.2 0.02 60 / ${0.22 + shade * 0.15}),
                        0 2px 4px -2px oklch(0.2 0.02 60 / 0.1),
                        inset 0 1px 0 oklch(1 0 0 / 0.95),
                        inset 0 -1px 0 oklch(0.15 0.02 60 / 0.03)
                      `,
                    }}
                  >
                    {/* Highlight sweep — sunlight catching the panel */}
                    <div
                      className="absolute inset-0 opacity-70"
                      style={{
                        background: `linear-gradient(${135 + light.x * 0.4}deg, oklch(1 0.008 85 / ${0.35 + shade * 0.25}) 0%, transparent 45%)`,
                      }}
                    />
                    {/* Micro content — subtle, only some panels */}
                    {i % 8 === 0 && (
                      <div className="absolute inset-0 p-2 flex flex-col gap-1 justify-end">
                        <span className="block h-[2px] w-4 rounded-full bg-ink/15" />
                        <span className="block h-[2px] w-6 rounded-full bg-ink/10" />
                      </div>
                    )}
                    {i % 13 === 0 && (
                      <div className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-accent/60" />
                    )}
                    {i % 17 === 0 && (
                      <div className="absolute inset-2 rounded-[3px] border border-ink/[0.06] bg-ink/[0.02]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ground shadow */}
          <div
            className="pointer-events-none absolute left-1/2 bottom-[8%] -translate-x-1/2 h-[40px] w-[62%] rounded-[50%] blur-3xl transition-all duration-[1200ms]"
            style={{
              background: "oklch(0.2 0.02 60 / 0.22)",
              transform: `translate(calc(-50% + ${(light.x - 50) * -0.5}px), 0) scaleX(${1 + Math.abs(light.x - 50) * 0.002})`,
            }}
          />

          {/* Recommendation card — appears once shape assembles */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-[6%] z-30 will-change-transform transition-all duration-700 ${
              showCard && !isTypingUser ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <div
              className="rounded-2xl bg-surface/95 backdrop-blur-md border border-ink/8 px-5 py-4 min-w-[300px]"
              style={{ boxShadow: "0 30px 70px -28px rgba(60,40,20,0.32), 0 2px 6px -2px rgba(60,40,20,0.06)" }}
            >
              <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-ink-muted/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Recommendation
              </div>
              <div key={scene.match} className="mt-2 text-[17px] font-semibold text-ink anim-fade-slide leading-tight tracking-tight">
                {scene.match}
              </div>
              <div className="mt-3 flex items-center gap-4 text-[12px] text-ink-muted tabular-nums">
                <span className="flex items-center gap-1.5">
                  <span className="text-ink font-semibold text-[13px]">{scene.score}</span>
                  <span className="text-ink-soft/80">AI Score</span>
                </span>
                <span className="h-3 w-px bg-line" />
                <span className="text-ink font-semibold text-[13px]">{scene.price}</span>
                <span className="h-3 w-px bg-line" />
                <span className="text-ink-soft/80">41 stores</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-ink-muted/70">Scroll</span>
        <span className="relative block h-14 w-px bg-ink-muted/20 overflow-hidden">
          <span className="absolute left-1/2 -translate-x-1/2 top-0 h-3 w-px bg-ink" style={{ animation: "scroll-line 2.4s cubic-bezier(0.7,0,0.3,1) infinite" }} />
        </span>
      </div>

      <style>{`
        @keyframes hero-dust {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(8px, -22px); }
        }
        @keyframes scroll-line {
          0%   { transform: translate(-50%, -100%); }
          60%  { transform: translate(-50%, 400%); }
          100% { transform: translate(-50%, 400%); opacity: 0; }
        }
        @keyframes halo-breathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.05); }
        }
        @keyframes panel-breathe {
          0%, 100% { translate: 0 0; }
          50%      { translate: 3px -5px; }
        }
        @keyframes back-drift {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(105%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-rise { animation: rise 0.95s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes fade-slide {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-slide { animation: fade-slide 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes dots {
          0%   { content: ""; }
          33%  { content: "."; }
          66%  { content: ".."; }
          100% { content: "..."; }
        }
        .anim-dots::after {
          content: "...";
          display: inline-block;
          width: 14px;
          animation: dots 1.2s steps(1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-rise, .anim-fade-slide { animation: none !important; opacity: 1 !important; transform: none !important; }
          [style*="panel-breathe"], [style*="back-drift"], [style*="hero-dust"] { animation: none !important; }
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
    <section className="slant-l relative z-10 bg-background py-10">
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

/* ---------- The Journey (What it does) — sticky parallax ---------- */

const journey = [
  {
    icon: Search,
    tag: "Ask",
    title: "Describe it. In your words.",
    copy: "Type what you're looking for the way you'd tell a friend. Our AI turns messy intent into the exact product you meant.",
    image: heroPhone,
    stat: { label: "Understood in", value: "0.4s" },
    chip: "quiet mechanical keyboard under ₹20k",
  },
  {
    icon: Scale,
    tag: "Compare",
    title: "Every option, side by side.",
    copy: "Specs, prices, real-world tradeoffs. We line up the shortlist so the winner becomes obvious in seconds.",
    image: dealKeyboard,
    stat: { label: "Options weighed", value: "142" },
    chip: "Keychron Q1  vs  Nuphy Air75",
  },
  {
    icon: Bot,
    tag: "Analyze",
    title: "Thousands of reviews. One verdict.",
    copy: "We read Amazon, Reddit, YouTube and trusted publications, then hand you the honest take — not the marketing one.",
    image: heroHeadphones,
    stat: { label: "Reviews scanned", value: "18,432" },
    chip: "Confidence  ·  98%",
  },
  {
    icon: TrendingDown,
    tag: "Time it",
    title: "Buy today, or wait 12 days.",
    copy: "Live price history across the internet tells you whether right now is the smart moment — or if patience saves you ₹6,000.",
    image: dealCamera,
    stat: { label: "Est. savings", value: "₹6,000" },
    chip: "Wait until Prime Day →",
  },
  {
    icon: Tag,
    tag: "Price",
    title: "Every major store. One glance.",
    copy: "Amazon, Flipkart, Croma, Reliance, official brand stores — the cheapest verified price surfaces first, always.",
    image: dealEarbuds,
    stat: { label: "Best price", value: "₹18,999" },
    chip: "Amazon  ·  -24%",
  },
  {
    icon: CalendarDays,
    tag: "Alert",
    title: "Never miss another big drop.",
    copy: "Prime Day, Big Billion, Black Friday — the sales you actually care about, delivered before the internet is picked clean.",
    image: salePrimeDay,
    stat: { label: "Next big sale", value: "04d 12h" },
    chip: "Prime Day  ·  Jul 16",
  },
];

function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight;
      const total = rect.height - wh;
      const scrolled = -rect.top;
      const next = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
      setP(next);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return { ref, p };
}

function FeatureStrip() {
  const { ref, p } = useScrollProgress<HTMLDivElement>();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const steps = journey.length;
  const raw = p * steps;
  const active = Math.min(steps - 1, Math.max(0, Math.floor(raw)));
  const rawLocal = Math.min(1, Math.max(0, raw - active));
  // eased local progress for smoother, more cinematic transitions
  const local =
    rawLocal < 0.5
      ? 2 * rawLocal * rawLocal
      : 1 - Math.pow(-2 * rawLocal + 2, 2) / 2;

  const current = journey[active];
  

  const onMove = (e: React.MouseEvent) => {
    const b = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setMouse({
      x: (e.clientX - b.left) / b.width - 0.5,
      y: (e.clientY - b.top) / b.height - 0.5,
    });
  };

  return (
    <section
      ref={ref}
      className="slant-r relative z-10 bg-surface-2/60"
      style={{ height: `${steps * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        onMouseMove={onMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      >
        {/* ===== ambient layers ===== */}
        {/* subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.55 0.008 70 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.55 0.008 70 / 0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        {/* conic aurora — slowly rotating chromatic wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] anim-spin-slower"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, oklch(0.68 0.17 45 / 0.22), oklch(0.72 0.12 60 / 0.10), oklch(0.78 0.14 90 / 0.18), oklch(0.68 0.17 45 / 0.22))",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
        {/* aurora blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-56 -left-40 h-[720px] w-[820px] rounded-full opacity-70 anim-float-slow"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.68 0.17 45 / 0.22), transparent 70%)",
            transform: `translate(${mouse.x * -40}px, ${mouse.y * -30}px)`,
            transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 right-[-10%] h-[720px] w-[820px] rounded-full opacity-60 anim-float"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.72 0.12 60 / 0.22), transparent 70%)",
            transform: `translate(${mouse.x * 40}px, ${mouse.y * 30}px)`,
            transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        />
        {/* cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90 mix-blend-overlay"
          style={{
            background: `radial-gradient(600px circle at ${(mouse.x + 0.5) * 100}% ${(mouse.y + 0.5) * 100}%, oklch(0.99 0.02 70 / 0.45), transparent 60%)`,
          }}
        />
        {/* diagonal light sweep tied to step progress */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -inset-y-20 w-[46vw] blur-3xl opacity-60"
            style={{
              left: `${-30 + (active + local) * 22}%`,
              background:
                "linear-gradient(100deg, transparent 20%, oklch(0.68 0.17 45 / 0.55) 50%, transparent 80%)",
              transition: "left 900ms cubic-bezier(0.2,0.8,0.2,1)",
              transform: "rotate(8deg)",
            }}
          />
        </div>
        {/* film grain / noise overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "260px 260px",
          }}
        />
        {/* soft vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, oklch(0.15 0.02 60 / 0.18) 100%)",
          }}
        />

        {/* giant background numeral */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-10">
            <div
              key={active}
              className="absolute right-[42%] top-1/2 -translate-y-1/2 text-[38vw] md:text-[26vw] leading-none font-semibold tabular-nums anim-reveal"
              style={{
                letterSpacing: "-0.06em",
                transform: `translate(-50%, calc(-50% + ${mouse.y * 20}px)) translateX(${mouse.x * 30}px)`,
                transition: "transform 800ms cubic-bezier(0.2,0.8,0.2,1)",
                backgroundImage:
                  "linear-gradient(180deg, oklch(0.35 0.02 60 / 0.09), oklch(0.35 0.02 60 / 0.02))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextStroke: "1px oklch(0.55 0.008 70 / 0.08)",
                filter: "drop-shadow(0 20px 40px oklch(0.68 0.17 45 / 0.08))",
              }}
            >
              0{active + 1}
            </div>
          </div>
        </div>

        <div className="relative h-full mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* LEFT — story panel */}
          <div className="md:col-span-5 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="eyebrow">The Journey</span>
              <span className="h-px w-10 bg-line" />
              <span className="text-[11px] font-medium text-ink-muted tabular-nums">
                0{active + 1} <span className="text-ink-muted/50">/ 06</span>
              </span>
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-background/70 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Live
              </span>
            </div>

            {/* rotating icon halo */}
            <div className="mb-6 flex items-center gap-3">
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background">
                <span
                  aria-hidden
                  className="absolute inset-[-6px] rounded-full border border-dashed border-accent/40 anim-spin-slow"
                />
                <current.icon size={16} strokeWidth={1.6} />
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">
                {current.tag}
              </span>
            </div>

            {/* rotating title stack */}
            <div className="relative h-[180px] md:h-[240px]">
              {journey.map((s, i) => {
                const dist = i - active - local;
                const opacity = Math.max(0, 1 - Math.abs(dist) * 1.6);
                const ty = dist * 46;
                const blur = Math.min(6, Math.abs(dist) * 6);
                return (
                  <h2
                    key={s.title}
                    aria-hidden={i !== active}
                    className="absolute inset-0 display text-4xl md:text-6xl leading-[0.98] tracking-tight text-balance"
                    style={{
                      opacity,
                      transform: `translateY(${ty}px)`,
                      filter: `blur(${blur}px)`,
                      transition:
                        "opacity 500ms ease, transform 700ms cubic-bezier(0.2,0.8,0.2,1), filter 500ms ease",
                    }}
                  >
                    {s.title}
                  </h2>
                );
              })}
            </div>

            {/* copy */}
            <div className="relative h-[110px] mt-2">
              {journey.map((s, i) => (
                <p
                  key={s.copy}
                  className="absolute inset-0 max-w-md text-ink-soft text-base md:text-[17px] leading-relaxed"
                  style={{
                    opacity: i === active ? 1 - local * 0.4 : 0,
                    transform: `translateY(${(i - active - local) * 20}px)`,
                    transition:
                      "opacity 500ms ease, transform 700ms cubic-bezier(0.2,0.8,0.2,1)",
                  }}
                >
                  {s.copy}
                </p>
              ))}
            </div>

            {/* progress rail */}
            <div className="mt-10 flex items-center gap-2">
              {journey.map((s, i) => {
                const isDone = i < active;
                const isCurrent = i === active;
                return (
                  <div key={s.title} className="flex-1 group">
                    <div className="h-[2px] w-full bg-line/70 overflow-hidden rounded-full">
                      <div
                        className="h-full bg-ink transition-all duration-500"
                        style={{
                          width: isDone ? "100%" : isCurrent ? `${local * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] tabular-nums text-ink-muted">
                      <span className={isCurrent ? "text-ink font-semibold" : ""}>
                        0{i + 1}
                      </span>
                      <span className="hidden md:inline truncate">{s.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — 3D image stage */}
          <div
            className="md:col-span-7 relative h-[52vh] md:h-[74vh]"
            style={{ perspective: "1600px" }}
          >
            {/* halo glow behind the stage */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 rounded-[40px] opacity-80 anim-float-slow"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.68 0.17 45 / 0.28), transparent 70%)",
                filter: "blur(40px)",
                transform: `translate(${mouse.x * 20}px, ${mouse.y * 14}px)`,
                transition: "transform 700ms cubic-bezier(0.2,0.8,0.2,1)",
              }}
            />
            <div
              className="absolute inset-0 rounded-[28px] overflow-hidden bg-background border border-line/60 shadow-[0_60px_160px_-40px_oklch(0.15_0.02_60_/_0.55),0_0_0_1px_oklch(1_0_0_/_0.04)_inset] will-change-transform"
              style={{
                transform: `perspective(1600px) rotateX(${mouse.y * -7}deg) rotateY(${mouse.x * 10}deg)`,
                transition: "transform 600ms cubic-bezier(0.2,0.8,0.2,1)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* image stack — clean 3D crossfade, no ghost blur */}
              {journey.map((s, i) => {
                const dist = i - active - local;
                // Only render the immediate neighbours so we never see blurred ghosts
                if (Math.abs(dist) > 1.001) return null;
                const isActive = i === active;
                // Ken-burns on the active image, gentle depth shift on neighbours
                const scale = isActive ? 1.06 + local * 0.05 : 1.02;
                const tx = dist * 12 + mouse.x * 18;
                const ty = mouse.y * 12;
                const tz = isActive ? 0 : -120;
                const rotY = dist * 6;
                const opacity =
                  dist <= 0
                    ? Math.max(0, 1 + dist) // outgoing fades out
                    : Math.max(0, 1 - dist * 1.15); // incoming fades in
                return (
                  <div
                    key={s.image}
                    aria-hidden={!isActive}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      opacity,
                      transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${rotY}deg) scale(${scale})`,
                      transformStyle: "preserve-3d",
                      transition:
                        "opacity 900ms cubic-bezier(0.2,0.8,0.2,1), transform 1100ms cubic-bezier(0.2,0.8,0.2,1)",
                    }}
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                    {/* cinematic vignette */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 40%, transparent 45%, oklch(0.15 0.02 60 / 0.35) 100%), linear-gradient(180deg, transparent 40%, oklch(0.15 0.02 60 / 0.55) 100%)",
                      }}
                    />
                  </div>
                );
              })}

              {/* soft light sweep on step change — subtle, no more glitch flash */}
              <div
                aria-hidden
                key={`sweep-${active}`}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 35%, oklch(1 0 0 / 0.22) 50%, transparent 65%)",
                  animation: "sheen-sweep 1400ms cubic-bezier(0.2,0.8,0.2,1) both",
                  mixBlendMode: "screen",
                }}
              />

              {/* inner rim highlight for depth */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[28px]"
                style={{
                  boxShadow:
                    "inset 0 1px 0 oklch(1 0 0 / 0.25), inset 0 -60px 120px -60px oklch(0.15 0.02 60 / 0.55)",
                }}
              />


              {/* corner brackets */}
              <div className="pointer-events-none absolute inset-4">
                <span className="absolute top-0 left-0 h-4 w-4 border-t border-l border-background/70" />
                <span className="absolute top-0 right-0 h-4 w-4 border-t border-r border-background/70" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-background/70" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-background/70" />
              </div>

              {/* AI query chip (top-left) */}
              <div
                key={`chip-${active}`}
                className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-md border border-line px-4 py-2 text-[12px] text-ink shadow-[0_8px_24px_-12px_oklch(0.15_0.02_60_/_0.4)] anim-reveal"
                style={{
                  transform: `translate3d(${mouse.x * -22}px, ${mouse.y * -14}px, 40px)`,
                  transition: "transform 400ms cubic-bezier(0.2,0.8,0.2,1)",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-medium">{current.chip}</span>
                <span className="ml-1 h-3 w-px bg-ink/40 anim-caret" />
              </div>

              {/* stat card (bottom-right) */}
              <div
                key={`stat-${active}`}
                className="absolute bottom-6 right-6 rounded-2xl bg-background/95 backdrop-blur-md border border-line px-5 py-4 shadow-[0_20px_40px_-20px_oklch(0.15_0.02_60_/_0.5)] anim-reveal"
                style={{
                  transform: `translate3d(${mouse.x * -28}px, ${mouse.y * -18}px, 60px)`,
                  transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)",
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  {current.stat.label}
                </div>
                <div className="mt-1 display text-3xl tabular-nums text-ink">
                  {current.stat.value}
                </div>
                <div className="mt-2 h-[2px] w-full bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${(active + local) / steps * 100}%` }}
                  />
                </div>
              </div>

              {/* floating mini card (bottom-left) */}
              <div
                className="absolute bottom-6 left-6 rounded-xl bg-background/90 backdrop-blur-md border border-line px-3 py-2 text-[11px] text-ink-soft flex items-center gap-2"
                style={{
                  transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -8}px, 30px)`,
                  transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                <span className="tabular-nums">Step 0{active + 1} of 06</span>
              </div>

              {/* corner meta */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 text-[10px] font-medium text-background/90 mix-blend-difference">
                <span className="tabular-nums">0{active + 1}</span>
                <span className="opacity-50">→</span>
                <span className="tabular-nums opacity-60">
                  0{Math.min(steps, active + 2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-ink-muted">
          <span>Scroll</span>
          <span className="h-px w-8 bg-ink-muted/40 relative overflow-hidden">
            <span className="absolute inset-y-0 left-0 w-1/3 bg-ink animate-[marquee_2s_linear_infinite]" />
          </span>
        </div>

        <style>{`
          @keyframes sheen-sweep {
            0%   { transform: translateX(-60%); opacity: 0; }
            25%  { opacity: 1; }
            100% { transform: translateX(60%); opacity: 0; }
          }
        `}</style>
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
    <section className="slant-l relative z-10 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="eyebrow">Today's deals</div>
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
  { name: "Wearables", img: dealWatch, count: "640" },
  { name: "Cameras", img: dealCamera, count: "380" },
  { name: "Accessories", img: catAccessories, count: "3,120" },
];

function Categories() {
  return (
    <section className="slant-r relative z-10 py-24 md:py-32 bg-surface-2/60">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-8">
            <div className="eyebrow">Categories</div>
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
    <section className="slant-l relative z-10 bg-background py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-center mb-20">
          <div className="eyebrow">AI Comparison</div>
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

/* ---------- AI Review — Review Intelligence ---------- */

const REVIEW_STATUS = [
  "Reading Amazon reviews…",
  "Analyzing Reddit discussions…",
  "Comparing YouTube long-form reviews…",
  "Checking long-term complaints…",
  "Finding recurring issues…",
  "Weighing verified purchases…",
  "Calculating final confidence…",
];

const REVIEW_SOURCES = [
  { name: "Amazon", count: "4,200", weight: 92 },
  { name: "Flipkart", count: "2,300", weight: 68 },
  { name: "Reddit", count: "900 threads", weight: 46 },
  { name: "YouTube", count: "150 videos", weight: 34 },
  { name: "Professional", count: "38 sites", weight: 22 },
];

const REVIEW_PROS = [
  "Class-leading OLED display",
  "Battery reliably exceeds 12 hrs",
  "Silent under normal workloads",
  "Excellent low-travel keyboard",
];

const REVIEW_CONS = [
  "Webcam quality is average",
  "Only two USB-C ports",
  "Fingerprint-prone finish",
];

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function AIReview() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const reviews = useCountUp(18432, inView, 1800);
  const confidence = useCountUp(98, inView, 1600);
  const score = useCountUp(94, inView, 1600); // 9.4
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStatusIdx((i) => (i + 1) % REVIEW_STATUS.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      className="slant-r relative z-10 relative overflow-hidden py-28 md:py-40 bg-surface-2/60"
    >
      {/* Ambient warm lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(50% 45% at 12% 25%, oklch(0.97 0.02 70 / 0.9), transparent 60%), radial-gradient(45% 40% at 88% 75%, oklch(0.96 0.025 50 / 0.55), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* ---- LEFT ---- */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="eyebrow">Review intelligence</div>
          <h2 className="display mt-6 text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
            Every review.
            <br />
            <span className="font-normal text-ink-soft">One verdict.</span>
          </h2>
          <p className="mt-8 text-[15px] leading-relaxed text-ink-soft max-w-md">
            Our AI reads reviews from stores, YouTube, Reddit, trusted
            publications and communities — then surfaces the real strengths and
            weaknesses.
          </p>

          {/* Live status */}
          <div className="mt-10 flex items-center gap-3 text-[13px] text-ink-soft">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span
              key={statusIdx}
              className="tabular-nums animate-[fade-in_0.5s_ease-out]"
            >
              {REVIEW_STATUS[statusIdx]}
            </span>
          </div>

          {/* Rotating source ribbon */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-[0.16em] uppercase text-ink-muted">
            <span>Amazon</span>
            <span>·</span>
            <span>Flipkart</span>
            <span>·</span>
            <span>Reddit</span>
            <span>·</span>
            <span>YouTube</span>
            <span>·</span>
            <span>The Verge</span>
            <span>·</span>
            <span>MKBHD</span>
          </div>
        </div>

        {/* ---- RIGHT: AI Verdict Panel ---- */}
        <div className="lg:col-span-7">
          <div
            className="relative rounded-[28px] bg-surface border border-line/70 p-8 md:p-10 soft-shadow overflow-hidden"
            style={{
              boxShadow:
                "0 40px 100px -50px oklch(0.15 0.02 60 / 0.35), 0 1px 0 oklch(1 0 0 / 0.6) inset",
            }}
          >
            {/* Subtle glow */}
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.96 0.05 65 / 0.5), transparent)",
              }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between text-[12px] text-ink-muted">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-background">
                  <Bot size={12} />
                </span>
                <span>PricePilot AI · Verdict</span>
              </div>
              <span className="text-[11px] tracking-[0.22em] uppercase text-ink-muted">
                Aurora Pro 15
              </span>
            </div>

            {/* Score row */}
            <div className="relative mt-8 grid grid-cols-3 gap-6 border-b border-line pb-8">
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
                  Overall
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="display text-5xl md:text-6xl tabular-nums leading-none">
                    {(score / 10).toFixed(1)}
                  </span>
                  <span className="text-[13px] text-ink-muted">/10</span>
                </div>
                <div className="mt-2 text-[11px] font-medium text-accent tracking-wide">
                  Excellent
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
                  Confidence
                </div>
                <div className="mt-2 display text-3xl md:text-4xl tabular-nums leading-none">
                  {confidence}
                  <span className="text-[13px] text-ink-muted ml-0.5">%</span>
                </div>
                <div className="mt-3 h-[3px] rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full bg-ink transition-[width] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
                  Sources
                </div>
                <div className="mt-2 display text-3xl md:text-4xl tabular-nums leading-none">
                  {reviews.toLocaleString()}
                </div>
                <div className="mt-2 text-[11px] text-ink-muted">
                  reviews analyzed
                </div>
              </div>
            </div>

            {/* Pros / Cons chips */}
            <div className="relative mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="eyebrow mb-4 flex items-center gap-2 text-accent">
                  <Plus size={12} /> Pros
                </div>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_PROS.map((p, i) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink transition-all duration-500 hover:border-ink hover:-translate-y-0.5"
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : "translateY(6px)",
                        transitionDelay: `${400 + i * 120}ms`,
                      }}
                    >
                      <Check size={12} className="text-accent" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="eyebrow mb-4 flex items-center gap-2 text-ink-muted">
                  <Minus size={12} /> Cons
                </div>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_CONS.map((c, i) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-soft transition-all duration-500 hover:border-ink-soft hover:-translate-y-0.5"
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : "translateY(6px)",
                        transitionDelay: `${400 + i * 120}ms`,
                      }}
                    >
                      <Minus size={12} className="text-ink-muted" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Source breakdown */}
            <div className="relative mt-10 border-t border-line pt-8">
              <div className="eyebrow mb-5">Where the AI looked</div>
              <div className="space-y-3">
                {REVIEW_SOURCES.map((s, i) => (
                  <div
                    key={s.name}
                    className="grid grid-cols-[110px_1fr_90px] items-center gap-4 text-[12.5px]"
                  >
                    <span className="text-ink">{s.name}</span>
                    <span className="relative h-[6px] rounded-full bg-line overflow-hidden">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          width: inView ? `${s.weight}%` : "0%",
                          transitionDelay: `${300 + i * 120}ms`,
                        }}
                      />
                    </span>
                    <span className="text-right tabular-nums text-ink-muted">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Verdict */}
            <div
              className="relative mt-10 rounded-2xl border border-line bg-ink text-background p-6 md:p-7 transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(10px)",
                transitionDelay: "1200ms",
              }}
            >
              <div className="flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase text-background/60">
                <Sparkles size={12} className="text-accent" />
                AI Recommendation
              </div>
              <p className="mt-3 text-[16px] md:text-[17px] leading-relaxed text-background text-balance">
                The Aurora Pro 15 is currently the best laptop under
                <span className="text-background"> ₹1.3L</span> if battery life
                and display quality are your priorities.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-background text-ink text-[13px] font-medium hover:bg-background/90 transition-colors">
                  Buy now <ArrowRight size={14} />
                </button>
                <button className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-background/25 text-background/85 text-[13px] hover:border-background/50 transition-colors">
                  Wait for Prime Day
                </button>
                <span className="text-[11px] text-background/50 ml-auto">
                  Save an est. ₹6,000 in 4 days
                </span>
              </div>
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
    <section className="slant-l relative z-10 py-28 md:py-36 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-8">
            <div className="eyebrow">Timing intelligence</div>
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

/* ---------- Upcoming Sales — Premium event announcements ---------- */

type Sale = {
  name: string;
  store: string;
  when: string;
  days: number;
  categories: string[];
  discount: string;
  insight: string;
  image: string;
  tint: string; // overlay tint (oklch)
  logoTone: string; // text color for store logo
};

const sales: Sale[] = [
  {
    name: "Prime Day",
    store: "Amazon",
    when: "Jul 15 – 16",
    days: 4,
    categories: ["Electronics", "Gaming", "Fashion"],
    discount: "Up to 60% off",
    insight: "Historically the biggest discounts on laptops and accessories.",
    image: salePrimeDay,
    tint: "oklch(0.18 0.06 245 / 0.55)",
    logoTone: "oklch(0.96 0.02 220)",
  },
  {
    name: "Great Indian Festival",
    store: "Amazon",
    when: "Oct 8 – 15",
    days: 89,
    categories: ["Phones", "Home", "Fashion"],
    discount: "Up to 70% off",
    insight: "Phone prices usually drop 15–20% during festive week.",
    image: saleGIF,
    tint: "oklch(0.22 0.09 45 / 0.5)",
    logoTone: "oklch(0.96 0.05 75)",
  },
  {
    name: "Big Billion Days",
    store: "Flipkart",
    when: "Oct 9 – 15",
    days: 90,
    categories: ["TVs", "Appliances", "Audio"],
    discount: "Up to 80% off",
    insight: "Great for headphones, TVs and premium audio gear.",
    image: saleBBD,
    tint: "oklch(0.2 0.09 245 / 0.5)",
    logoTone: "oklch(0.96 0.03 240)",
  },
  {
    name: "Black Friday",
    store: "Global",
    when: "Nov 28",
    days: 140,
    categories: ["Laptops", "Cameras", "Wearables"],
    discount: "Up to 75% off",
    insight: "Best time to buy gaming laptops and creator gear.",
    image: saleBlackFriday,
    tint: "oklch(0.08 0.01 60 / 0.55)",
    logoTone: "oklch(0.92 0.02 60)",
  },
];

const tickerItems = [
  "RTX 5070",
  "iPhone 18",
  "Pixel 11",
  "MacBook Pro",
  "Prime Day",
  "OLED Monitors",
  "Vision Pro 2",
  "PS6 Rumors",
  "Galaxy S26",
];

function Countdown({ days, active }: { days: number; active?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={
          "display leading-none tabular-nums " +
          (active
            ? "text-[52px] md:text-[64px] text-background"
            : "text-[40px] md:text-[48px] text-background/85")
        }
      >
        {String(days).padStart(2, "0")}
      </span>
      <span className="flex flex-col text-[10px] tracking-[0.22em] uppercase text-background/60 leading-tight">
        <span>Days</span>
        <span>Left</span>
      </span>
    </div>
  );
}

function SaleCard({ sale, index, active }: { sale: Sale; index: number; active: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, hover: false });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 10,
      mx: px * 100,
      my: py * 100,
      hover: true,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50, hover: false });

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "group relative shrink-0 overflow-hidden rounded-[32px] bg-ink transition-[box-shadow,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform " +
        "w-[86vw] sm:w-[420px] md:w-[440px] lg:w-[460px] h-[600px] md:h-[640px] " +
        (active
          ? "shadow-[0_50px_140px_-40px_oklch(0.15_0.02_60_/_0.55),0_0_0_1px_oklch(0.72_0.16_55_/_0.35)]"
          : "shadow-[0_24px_70px_-30px_oklch(0.15_0.02_60_/_0.35)] ring-1 ring-ink/20")
      }
      style={{
        transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.hover ? -10 : active ? -4 : 0}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Poster image */}
      <img
        src={sale.image}
        alt={`${sale.name} poster`}
        loading="lazy"
        width={1280}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `scale(${tilt.hover ? 1.09 : 1.02}) translate(${(tilt.mx - 50) * 0.06}px, ${(tilt.my - 50) * 0.06}px)` }}
      />
      {/* Tint */}
      <div className="absolute inset-0" style={{ background: sale.tint }} />
      {/* Deep vignette kills bright poster edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 40%, transparent 42%, oklch(0.14 0.02 60 / 0.55) 78%, oklch(0.08 0.02 60 / 0.95) 100%)",
        }}
      />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      {/* Top scrim */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at ${tilt.mx}% ${tilt.my}%, oklch(1 0.05 75 / 0.22), transparent 60%)`,
        }}
      />
      {/* Soft inner ring, no white */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-background/[0.06]" />
      {active && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px]"
          style={{
            boxShadow:
              "inset 0 0 0 1px oklch(0.72 0.16 55 / 0.35), inset 0 0 60px oklch(0.72 0.16 55 / 0.18)",
          }}
        />
      )}

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between p-7">
        <span className="text-[11px] tracking-[0.28em] uppercase text-background/70">
          0{index + 1} / 04
        </span>
        <span
          className="text-[13px] font-medium tracking-tight"
          style={{ color: sale.logoTone, opacity: 0.9 }}
        >
          {sale.store}
        </span>
      </div>

      {active && (
        <span className="absolute z-10 top-24 right-7 flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-background/85 before:content-[''] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent before:animate-pulse">
          Next up
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-7" style={{ transform: "translateZ(24px)" }}>
        <div className="text-[12px] text-background/70">{sale.when}</div>
        <h3 className="display mt-2 text-4xl md:text-[44px] text-background leading-[0.98] text-balance">
          {sale.name}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-wide text-background/70">
          {sale.categories.map((c, i) => (
            <span key={c} className="flex items-center gap-2">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-background/40" />}
              {c}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-background/75 max-w-[38ch]">
          {sale.insight}
        </p>

        <div className="mt-6 flex items-end justify-between border-t border-background/15 pt-5">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-background/55">
              Expected
            </div>
            <div className="mt-1 text-[14px] font-medium text-background">
              {sale.discount}
            </div>
          </div>
          <div
            className={
              "relative rounded-2xl px-4 py-2 " +
              (active ? "ring-1 ring-accent/50 bg-background/5 backdrop-blur-sm" : "")
            }
          >
            {active && (
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow:
                    "0 0 0 1px oklch(0.72 0.16 55 / 0.35), 0 0 30px oklch(0.72 0.16 55 / 0.35)",
                  animation: "pulse 2.6s ease-in-out infinite",
                }}
              />
            )}
            <Countdown days={sale.days} active={active} />
          </div>
        </div>
      </div>
    </article>
  );
}

function UpcomingSales() {
  const soonestIndex = sales.reduce(
    (best, s, i) => (s.days < sales[best].days ? i : best),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(soonestIndex);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Auto-cycle the highlighted card every few seconds
  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % sales.length);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  // Scroll the horizontal deck to keep the active card in view
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelectorAll<HTMLElement>("[data-sale-card]")[activeIndex];
    if (!card) return;
    const target = card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeIndex]);

  return (
    <section className="slant-r relative z-10 overflow-hidden py-28 md:py-36 bg-surface-2/60">
      {/* Ambient background */}
      <div

        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 40% at 15% 20%, oklch(0.97 0.02 70 / 0.9), transparent 60%), radial-gradient(50% 40% at 85% 80%, oklch(0.96 0.03 45 / 0.7), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.2 0.02 60) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="eyebrow">Sales calendar</div>
            <h2 className="display mt-4 text-4xl md:text-6xl text-balance max-w-2xl leading-[1.02]">
              The next great sale,
              <br />
              <span className="font-normal text-ink-soft">already circled.</span>
            </h2>
          </div>
          <div className="max-w-sm text-[14px] text-ink-muted leading-relaxed">
            Four moments each year when prices actually move. PricePilot tracks every one — and tells you which is worth waiting for.
          </div>
        </div>

        {/* Timeline rail */}
        <div className="relative mt-16 md:mt-20">
          <div className="absolute left-0 right-0 top-6 h-px overflow-hidden">
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.2 0.02 60 / 0.15) 15%, oklch(0.2 0.02 60 / 0.25) 50%, oklch(0.2 0.02 60 / 0.15) 85%, transparent)",
              }}
            />
          </div>
          <div className="relative flex justify-between">
            {sales.map((s, i) => (
              <div key={s.name} className="flex flex-col items-center gap-3">
                <span
                  className={
                    "relative grid h-3 w-3 place-items-center rounded-full transition-all " +
                    (i === activeIndex
                      ? "bg-accent"
                      : "bg-background border border-line")
                  }
                >
                  {i === activeIndex && (
                    <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                  )}
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-ink-muted hidden md:inline">
                  {s.when.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic horizontal journey */}
        <div className="relative mt-10 -mx-6 md:-mx-10">
          <div
            ref={scrollerRef}
            className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 md:px-10 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ perspective: "1600px" }}
          >
            {sales.map((s, i) => (
              <button
                key={s.name}
                type="button"
                data-sale-card
                onClick={() => setActiveIndex(i)}
                className={
                  "snap-center text-left transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                  (i === activeIndex
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-90 blur-[0.5px] hover:blur-0 scale-[0.96]")
                }
              >
                <SaleCard sale={s} index={i} active={i === activeIndex} />
              </button>
            ))}
            <div className="shrink-0 w-4" />
          </div>
          {/* Edge fades — subtle, tuned to section bg, no hard white */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-40 z-10" style={{ background: "linear-gradient(to right, oklch(0.97 0.008 75) 0%, oklch(0.97 0.008 75 / 0.6) 40%, transparent 100%)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-40 z-10" style={{ background: "linear-gradient(to left, oklch(0.97 0.008 75) 0%, oklch(0.97 0.008 75 / 0.6) 40%, transparent 100%)" }} />
        </div>

        {/* Progress bar for auto-cycle */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
            {String(activeIndex + 1).padStart(2, "0")} / {String(sales.length).padStart(2, "0")}
          </span>
          <div className="relative flex-1 h-px bg-line overflow-hidden">
            <div
              key={activeIndex}
              className="absolute inset-y-0 left-0 bg-ink"
              style={{ animation: "sale-progress 3.8s linear forwards" }}
            />
          </div>
          <span className="text-[10px] tracking-[0.22em] uppercase text-ink-muted hidden md:inline">
            {sales[activeIndex].name}
          </span>
        </div>


        {/* Bottom ticker */}
        <div className="relative mt-16 border-t border-line pt-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-[0.28em] uppercase text-ink-muted whitespace-nowrap">
              Upcoming launches
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div
                className="flex gap-10 whitespace-nowrap"
                style={{ animation: "marquee 40s linear infinite" }}
              >
                {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="text-[13px] text-ink-soft/70 flex items-center gap-10"
                  >
                    {t}
                    <span className="text-ink-muted/40">↓</span>
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[oklch(0.97_0.008_75)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[oklch(0.97_0.008_75)] to-transparent" />
            </div>
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

const trendingExtras: { price: string; drop: string; spark: number[] }[] = [
  { price: "₹54,990", drop: "-18%", spark: [8, 6, 7, 5, 4, 3, 2] },
  { price: "₹24,900", drop: "-12%", spark: [7, 7, 6, 5, 6, 4, 3] },
  { price: "₹32,499", drop: "-22%", spark: [9, 8, 6, 7, 5, 4, 2] },
  { price: "₹18,750", drop: "-9%", spark: [6, 6, 5, 5, 4, 4, 3] },
  { price: "₹89,900", drop: "-15%", spark: [8, 7, 7, 6, 5, 5, 4] },
  { price: "₹1,29,999", drop: "-11%", spark: [9, 8, 8, 7, 6, 6, 5] },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 60;
  const h = 18;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / Math.max(1, max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendingCard({
  t,
  i,
  rank,
}: {
  t: (typeof trending)[number];
  i: number;
  rank: number;
}) {
  const ex = trendingExtras[i % trendingExtras.length];
  return (
    <a
      href="#"
      className="group relative shrink-0 w-[260px] md:w-[320px] block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-2">
        <img
          src={t.img}
          alt={t.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
        />
        {/* soft vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* rank badge */}
        <span className="absolute top-4 left-4 text-[11px] font-medium text-background bg-ink/75 backdrop-blur rounded-full px-2.5 py-1">
          #{rank} Trending
        </span>

        {/* drop chip */}
        <span className="absolute top-4 right-4 text-[11px] font-semibold text-background bg-[oklch(0.55_0.18_25)] rounded-full px-2.5 py-1 shadow-[0_6px_18px_-6px_oklch(0.55_0.18_25_/_0.5)]">
          {ex.drop}
        </span>

        {/* bottom info panel — slides up on hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
          <div className="rounded-2xl bg-background/85 backdrop-blur-md border border-line/60 px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Live price
              </div>
              <div className="text-[15px] font-semibold text-ink leading-tight">
                {ex.price}
              </div>
            </div>
            <div className="text-ink-muted">
              <Sparkline data={ex.spark} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            {t.cat}
          </div>
          <div className="text-[15px] font-medium text-ink mt-1">{t.name}</div>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-line group-hover:border-ink group-hover:bg-ink group-hover:text-background transition-all duration-300">
          <ArrowUpRight size={14} />
        </span>
      </div>
    </a>
  );
}

function TrendingMarquee({
  items,
  direction = "left",
  duration = 60,
}: {
  items: typeof trending;
  direction?: "left" | "right";
  duration?: number;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className="group/marquee relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex gap-6 w-max py-2"
        style={{
          animation: `marquee ${duration}s linear infinite${direction === "right" ? " reverse" : ""}`,
          animationPlayState: "running",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        {loop.map((t, i) => (
          <TrendingCard
            key={`${direction}-${i}`}
            t={t}
            i={i % items.length}
            rank={(i % items.length) + 1}
          />
        ))}
      </div>
    </div>
  );
}

function Trending() {
  return (
    <section className="slant-l relative z-10 py-28 md:py-36 bg-background overflow-hidden">
      {/* ambient background numeral */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 right-[-4vw] text-[26vw] font-black leading-none text-ink/[0.03] select-none"
      >
        01
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-12 gap-8 flex-wrap">
          <div>
            <div className="eyebrow flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.55_0.18_25)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.55_0.18_25)]" />
              </span>
              Trending now · updated live
            </div>
            <h2 className="display mt-4 text-4xl md:text-6xl">
              What India is buying.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] text-ink-soft">
              A living feed of the most-tracked products across PricePilot this
              hour. Hover any card to pause the scroll.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[12px] text-ink-muted">
            <span className="h-px w-10 bg-line" />
            auto-scrolling
            <span className="h-px w-10 bg-line" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <TrendingMarquee items={trending} direction="left" duration={55} />
        <TrendingMarquee
          items={[...trending].reverse()}
          direction="right"
          duration={70}
        />
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
  const navigate = useNavigate();
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const [phIdx, setPhIdx] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [fQuery, setFQuery] = useState("");

  const footerSubmit = (q: string) => {
    const t = q.trim();
    if (!t) return;
    navigate({ to: "/ai-assistant", search: { q: t } });
  };


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
      className="slant-r relative z-10 overflow-hidden shadow-[0_-24px_60px_-30px_oklch(0.15_0.02_60_/_0.12)]"
      style={{
        background:
          "radial-gradient(1200px 700px at 20% 10%, oklch(0.97 0.03 65), transparent 60%), radial-gradient(900px 600px at 85% 90%, oklch(0.96 0.04 30), transparent 55%), linear-gradient(180deg, oklch(0.985 0.008 75) 0%, oklch(0.965 0.014 60) 55%, oklch(0.95 0.02 45) 100%)",
      }}
    >
      {/* Aurora blob A — warm amber */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-70 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.82 0.14 55 / 0.55), transparent 70%)",
          animation: "aurora-shift 22s ease-in-out infinite",
        }}
      />
      {/* Aurora blob B — rose */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-40 h-[80vh] w-[80vh] rounded-full blur-3xl opacity-60 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.16 25 / 0.45), transparent 70%)",
          animation: "aurora-shift-2 28s ease-in-out infinite",
        }}
      />
      {/* Aurora blob C — cool accent for contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20vh] left-1/3 h-[65vh] w-[65vh] rounded-full blur-3xl opacity-55 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.10 240 / 0.35), transparent 70%)",
          animation: "aurora-shift 34s ease-in-out infinite reverse",
        }}
      />

      {/* Slow conic sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.4 0.15 50) 40deg, transparent 90deg, transparent 180deg, oklch(0.4 0.15 25) 220deg, transparent 270deg)",
          animation: "conic-spin 60s linear infinite",
          filter: "blur(40px)",
        }}
      />

      {/* Fine grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.2 0.02 60) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.2 0.02 60) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, oklch(1 0.03 75 / 0.85), transparent 60%)`,
          mixBlendMode: "overlay",
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

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />


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
          <form
            onSubmit={(e) => { e.preventDefault(); footerSubmit(fQuery || FOOTER_PLACEHOLDERS[phIdx]); }}
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
                value={fQuery}
                onChange={(e) => setFQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Ask PricePilot AI"
                placeholder=""
                className="peer absolute inset-0 w-full h-full bg-transparent outline-none text-[17px] text-ink placeholder:text-transparent"
              />
              {fQuery.length === 0 && (
                <button
                  type="button"
                  onClick={() => setFQuery(FOOTER_PLACEHOLDERS[phIdx])}
                  key={phIdx}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[17px] text-ink-muted peer-focus:opacity-0 transition-opacity duration-300 cursor-text"
                  style={{ animation: "footer-fade 0.6s ease-out" }}
                  tabIndex={-1}
                >
                  {FOOTER_PLACEHOLDERS[phIdx]}
                </button>
              )}
            </div>
            <button
              type="submit"
              className="group h-[60px] px-6 rounded-full bg-ink text-surface flex items-center gap-2.5 text-[14px] font-medium tracking-tight transition-transform duration-300 hover:scale-[1.02]"
            >
              Ask AI
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </form>
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
            <Link to="/deals" className="hover:text-ink transition-colors">Deals</Link>
            <Link to="/price-drops" className="hover:text-ink transition-colors">Price drops</Link>
            <Link to="/news" className="hover:text-ink transition-colors">News</Link>
            <Link to="/profile" className="hover:text-ink transition-colors">Account</Link>
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
  const [paletteOpen, setPaletteOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav onOpenSearch={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
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
