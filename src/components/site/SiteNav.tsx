import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Search, User, X, ArrowUpRight, Sparkles, Newspaper, Cpu, Smartphone, Headphones, Keyboard, Monitor, Gamepad2, Camera, Watch, Home } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { NAV_ITEMS } from "@/lib/nav";

/* ------------------------------ Mega menus ------------------------------- */

const CATEGORIES = [
  { icon: Cpu, name: "Laptops", desc: "Ultrabooks, workstations, gaming.", trending: ["MacBook Air M3", "ROG Zephyrus G14", "ThinkPad X1 Carbon"] },
  { icon: Smartphone, name: "Smartphones", desc: "Flagships to value picks.", trending: ["iPhone 17 Pro", "Pixel 10", "OnePlus 13"] },
  { icon: Headphones, name: "Audio", desc: "Cans, IEMs, wireless buds.", trending: ["Sony WH-1000XM6", "AirPods Pro 3", "Sennheiser Momentum 4"] },
  { icon: Keyboard, name: "Keyboards", desc: "Mechanical, low-profile, tenkeyless.", trending: ["Keychron Q1 HE", "NuPhy Air75 V2", "Logitech MX Keys"] },
  { icon: Monitor, name: "Monitors", desc: "OLED, ultrawide, 4K.", trending: ["LG 27\" OLED", "Dell U3225QE", "Samsung Odyssey OLED"] },
  { icon: Gamepad2, name: "Gaming", desc: "Consoles, GPUs, controllers.", trending: ["PS5 Pro", "RTX 5080", "Steam Deck OLED"] },
  { icon: Camera, name: "Cameras", desc: "Mirrorless, action, cinema.", trending: ["Sony α7 IV", "Fujifilm X100VI", "DJI Osmo Pocket 3"] },
  { icon: Watch, name: "Smartwatches", desc: "Fitness, health, dressy.", trending: ["Apple Watch Ultra 3", "Garmin Fenix 8", "Pixel Watch 3"] },
  { icon: Home, name: "Smart Home", desc: "Lights, hubs, security, robots.", trending: ["Aqara Hub M3", "Nanoleaf Skylight", "Roborock S8 Pro"] },
];

const DEAL_CHIPS = [
  { label: "Under ₹20,000", accent: "hot" },
  { label: "Under ₹50,000", accent: "" },
  { label: "Flagship phones", accent: "" },
  { label: "Gaming laptops", accent: "" },
  { label: "OLED monitors", accent: "" },
  { label: "Noise-cancelling", accent: "" },
];

const AI_PROMPTS = [
  "Best 14-inch laptop under ₹90,000",
  "Should I wait for the Pixel 11?",
  "Compare Sony WH-1000XM6 vs Bose QC Ultra",
  "OLED monitor for programming and design",
  "Camera for weekend travel — good in low light",
];

const NEWS_HEADLINES = [
  { kicker: "Launched", title: "Nothing Phone (3) breaks cover with dual-screen back", when: "2h ago" },
  { kicker: "Deal alert", title: "Sony WH-1000XM6 hits lowest ever at ₹24,990", when: "5h ago" },
  { kicker: "Report", title: "Amazon's Big Billion Days set for October 4", when: "Yesterday" },
  { kicker: "Rumor", title: "MacBook Pro M6 tipped for a redesigned chassis", when: "2d ago" },
];

/* ------------------------------ Component -------------------------------- */

type MenuKey = "Categories" | "Deals" | "AI Assistant" | "News" | null;

export function SiteNav({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpen(null); }, [pathname]);

  const isActive = (to: string) => pathname === to || (to !== "/" && pathname.startsWith(to));
  const hasMenu = (label: string): label is Exclude<MenuKey, null> =>
    label === "Categories" || label === "Deals" || label === "AI Assistant" || label === "News";

  // Position the sliding pill under whichever item is hovered/open, or the active route.
  useEffect(() => {
    const target = hovered ?? open ?? NAV_ITEMS.find((i) => isActive(i.to))?.label ?? null;
    if (!target || !navRef.current) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const el = itemRefs.current[target];
    const parent = navRef.current;
    if (!el) return;
    const eRect = el.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();
    setPill({ left: eRect.left - pRect.left, width: eRect.width, opacity: 1 });
  }, [hovered, open, pathname]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHovered(label);
    if (hasMenu(label)) setOpen(label);
    else setOpen(null);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => { setOpen(null); setHovered(null); }, 140);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          scrolled || open ? "pt-3" : "pt-5"
        }`}
        onMouseLeave={scheduleClose}
      >
        {/* Floating shell — pill shape, glass, subtle border, animates on scroll */}
        <div
          className={`mx-auto max-w-[1400px] px-4 md:px-6 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            scrolled || open ? "max-w-[1180px]" : ""
          }`}
        >
          <div
            className={`relative flex h-14 items-center justify-between rounded-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              scrolled || open
                ? "px-3 md:px-4 bg-background/70 border border-line shadow-[0_10px_40px_-20px_oklch(0.15_0.02_60/0.25)] backdrop-blur-2xl backdrop-saturate-150"
                : "px-4 md:px-6 bg-background/40 border border-line/40 backdrop-blur-xl backdrop-saturate-150"
            }`}
          >
            <Link to="/" className="flex items-center gap-2.5 group pr-2">
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-ink text-background text-[11px] font-semibold overflow-hidden">
                <span className="relative z-10">P</span>
                <span className="absolute inset-0 bg-gradient-to-br from-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </span>
              <span className="display text-[17px] tracking-tight leading-none">PricePilot</span>
            </Link>

            <nav
              ref={navRef}
              className="hidden lg:flex relative items-center px-1"
              onMouseLeave={() => setHovered(null)}
            >
              {/* Sliding pill background */}
              <span
                aria-hidden
                className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-surface-2/80 border border-line/60 transition-all duration-[420ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none"
                style={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
              />
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.to);
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => openMenu(item.label)}
                    className="relative"
                  >
                    <Link
                      ref={(el) => { itemRefs.current[item.label] = el; }}
                      to={item.to}
                      className={`relative z-10 flex items-center gap-1.5 px-3.5 h-9 rounded-full text-[13px] font-medium transition-colors duration-300 ${
                        active ? "text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      {item.label === "AI Assistant" && <Sparkles size={11} className="text-accent" />}
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenSearch}
                aria-label="Search"
                className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2 rounded-full text-[12.5px] text-ink-muted hover:text-ink transition-all border border-line/60 hover:border-ink/30 hover:bg-surface-2/60"
              >
                <Search size={14} strokeWidth={1.8} />
                <span className="hidden xl:inline">Search everything</span>
                <kbd className="ml-1 hidden xl:inline text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-3 text-ink-soft">⌘K</kbd>
              </button>
              <button onClick={onOpenSearch} aria-label="Search" className="md:hidden grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2/70 transition-colors">
                <Search size={17} strokeWidth={1.6} />
              </button>
              <Link to="/wishlist" aria-label="Wishlist" className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2/70 hover:text-ink transition-colors">
                <Heart size={17} strokeWidth={1.6} />
              </Link>
              <Link to="/profile" className="hidden md:inline-flex items-center gap-1.5 h-9 pl-3.5 pr-1.5 rounded-full bg-ink text-background text-[13px] font-medium hover:bg-ink/90 transition-all ml-1">
                Profile
                <span className="grid h-7 w-7 place-items-center rounded-full bg-background/15">
                  <User size={13} strokeWidth={1.8} />
                </span>
              </Link>
              <button aria-label="Menu" onClick={() => setMobileOpen((v) => !v)} className="lg:hidden grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2/70 transition-colors">
                <span className="flex flex-col gap-1"><span className="h-px w-4 bg-current" /><span className="h-px w-4 bg-current" /></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega menus */}
        <MegaMenu open={open === "Categories"} onMouseEnter={() => openMenu("Categories")} onMouseLeave={scheduleClose}>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <div className="eyebrow mb-3">Categories</div>
              <h3 className="display text-3xl leading-[1.05]">Every category,<br /> carefully curated.</h3>
              <p className="mt-4 text-[13px] text-ink-muted max-w-[26ch]">Hand-picked shortlists from thousands of products across every major store — updated hourly.</p>
              <Link to="/categories" className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium link-underline">
                Browse all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="col-span-8 grid grid-cols-3 gap-x-6 gap-y-5">
              {CATEGORIES.map(({ icon: Icon, name, desc, trending }) => (
                <Link key={name} to="/categories" className="group flex gap-3 p-3 -m-3 rounded-xl hover:bg-surface-2 transition-colors">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 border border-line/70 text-ink group-hover:bg-ink group-hover:text-background transition-colors">
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-ink">{name}</div>
                    <div className="text-[11.5px] text-ink-muted leading-snug">{desc}</div>
                    <div className="mt-1 text-[11px] text-ink-soft truncate">{trending[0]} · {trending[1]}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </MegaMenu>

        <MegaMenu open={open === "Deals"} onMouseEnter={() => openMenu("Deals")} onMouseLeave={scheduleClose}>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <div className="eyebrow mb-3">Today's Deals</div>
              <h3 className="display text-3xl leading-[1.05]">Handpicked drops,<br /> verified worth-it.</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {DEAL_CHIPS.map((c) => (
                  <Link key={c.label} to="/deals" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-colors ${c.accent === "hot" ? "bg-ink text-background border-ink" : "border-line hover:border-ink"}`}>
                    {c.accent === "hot" && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-7 grid grid-cols-2 gap-4">
              {[
                { title: "Sony WH-1000XM6", meta: "Audio · Lowest ever", price: "₹24,990", drop: "-32%" },
                { title: "MacBook Air M3", meta: "Laptops · Great time to buy", price: "₹94,990", drop: "-18%" },
                { title: "LG 27\" OLED", meta: "Monitors · Rare drop", price: "₹78,500", drop: "-27%" },
                { title: "Pixel 10", meta: "Phones · Best of year", price: "₹64,999", drop: "-14%" },
              ].map((d) => (
                <Link key={d.title} to="/deals" className="group p-4 rounded-xl border border-line hover:border-ink/50 hover:bg-surface-2 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-ink">{d.title}</div>
                      <div className="text-[11.5px] text-ink-muted mt-0.5">{d.meta}</div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-[oklch(0.42_0.14_45)]">{d.drop}</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="text-[15px] font-semibold display">{d.price}</div>
                    <ArrowUpRight size={14} className="text-ink-muted group-hover:text-ink transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </MegaMenu>

        <MegaMenu open={open === "AI Assistant"} onMouseEnter={() => openMenu("AI Assistant")} onMouseLeave={scheduleClose}>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <div className="eyebrow mb-3 inline-flex items-center gap-2"><Sparkles size={11} /> AI Assistant</div>
              <h3 className="display text-3xl leading-[1.05]">Ask, don't scroll.</h3>
              <p className="mt-4 text-[13px] text-ink-muted max-w-[30ch]">Have a real conversation about what you want to buy. PricePilot researches, compares, and gives you a straight answer.</p>
              <Link to="/ai-assistant" className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink text-background text-[13px] font-medium px-4 h-9 magnetic">
                Start a conversation <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="col-span-7">
              <div className="eyebrow mb-3">Try asking</div>
              <div className="space-y-2">
                {AI_PROMPTS.map((p) => (
                  <Link key={p} to="/ai-assistant" className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-line hover:border-ink/50 hover:bg-surface-2 transition-colors">
                    <span className="text-[13px] text-ink">{p}</span>
                    <ArrowUpRight size={13} className="text-ink-muted" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </MegaMenu>

        <MegaMenu open={open === "News"} onMouseEnter={() => openMenu("News")} onMouseLeave={scheduleClose}>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <div className="eyebrow mb-3 inline-flex items-center gap-2"><Newspaper size={11} /> News</div>
              <h3 className="display text-3xl leading-[1.05]">The shopping<br /> desk.</h3>
              <p className="mt-4 text-[13px] text-ink-muted max-w-[26ch]">Launches, drops, rumors and shopping intelligence — written by humans, sharpened by AI.</p>
              <Link to="/news" className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium link-underline">
                Read all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="col-span-8 space-y-2">
              {NEWS_HEADLINES.map((h) => (
                <Link key={h.title} to="/news" className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl border border-line hover:border-ink/50 hover:bg-surface-2 transition-colors">
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent">{h.kicker}</div>
                    <div className="text-[13.5px] font-semibold text-ink leading-snug mt-0.5">{h.title}</div>
                  </div>
                  <div className="text-[11px] text-ink-muted whitespace-nowrap pt-1">{h.when}</div>
                </Link>
              ))}
            </div>
          </div>
        </MegaMenu>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden pointer-events-none ${mobileOpen ? "" : ""}`}>
        <div
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-background border-l border-line pt-20 px-6 pb-8 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${mobileOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full"}`}
        >
          <button onClick={() => setMobileOpen(false)} aria-label="Close" className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2"><X size={16} /></button>
          <div className="eyebrow mb-4">Menu</div>
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center justify-between py-4 border-b border-line text-[22px] display" onClick={() => setMobileOpen(false)}>
                {item.label}
                <ArrowUpRight size={18} className="text-ink-muted" />
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex gap-3">
            <Link to="/profile" className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-ink text-background text-[13px] font-medium">Profile</Link>
            <Link to="/wishlist" className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full border border-line text-[13px] font-medium">Wishlist</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function MegaMenu({ open, children, onMouseEnter, onMouseLeave }: { open: boolean; children: ReactNode; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute inset-x-0 top-full origin-top transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-8">
        <div className="rounded-3xl bg-background/95 backdrop-blur-2xl border border-line shadow-[0_40px_80px_-40px_oklch(0.15_0.02_60/0.25)] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Command Palette ----------------------------- */

const TRENDING = ["MacBook Air M3", "Sony WH-1000XM6", "Pixel 10", "RTX 5080", "iPhone 17 Pro", "Steam Deck OLED"];
const QUICK_LINKS: { label: string; to: (typeof NAV_ITEMS)[number]["to"] }[] = [
  { label: "Today's Deals", to: "/deals" },
  { label: "Compare products", to: "/compare" },
  { label: "Price drops this week", to: "/price-drops" },
  { label: "Sales calendar", to: "/sales-calendar" },
  { label: "Ask the AI", to: "/ai-assistant" },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return TRENDING.filter((t) => t.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);

  return (
    <div className={`fixed inset-0 z-[70] transition-opacity duration-400 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-2xl" onClick={onClose} />
      <div className={`relative mx-auto mt-[10vh] max-w-2xl px-4 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}>
        <div className="rounded-3xl bg-background/95 backdrop-blur-2xl border border-line shadow-[0_60px_120px_-40px_oklch(0.15_0.02_60/0.35)] overflow-hidden">
          <div className="flex items-center gap-3 px-5 h-16 border-b border-line">
            <Search size={18} className="text-ink-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands, categories…"
              className="flex-1 bg-transparent outline-none text-[16px] display placeholder:text-ink-muted"
            />
            <kbd className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-surface-3 text-ink-soft">ESC</kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {results.length > 0 && (
              <Section title="Results">
                {results.map((r) => (
                  <PaletteRow key={r} to="/deals" onClose={onClose} label={r} sub="Product" />
                ))}
              </Section>
            )}
            {!q && (
              <>
                <Section title="Trending">
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button key={t} onClick={() => setQ(t)} className="text-[12px] px-3 py-1.5 rounded-full border border-line hover:border-ink transition-colors">{t}</button>
                    ))}
                  </div>
                </Section>
                <Section title="Quick actions">
                  {QUICK_LINKS.map((l) => (
                    <PaletteRow key={l.label} to={l.to} onClose={onClose} label={l.label} sub={l.to} />
                  ))}
                </Section>
              </>
            )}
            {q && results.length === 0 && (
              <div className="py-10 text-center text-[13px] text-ink-muted">
                Nothing matched — try asking the <Link to="/ai-assistant" onClick={onClose} className="text-ink underline underline-offset-4">AI Assistant</Link>.
              </div>
            )}
          </div>

          <div className="px-5 h-11 border-t border-line flex items-center justify-between text-[11px] text-ink-muted">
            <span>Try <span className="text-ink">MacBook</span>, <span className="text-ink">Sony</span>, or <span className="text-ink">OLED monitor</span></span>
            <span>PricePilot Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function PaletteRow({ to, onClose, label, sub }: { to: (typeof NAV_ITEMS)[number]["to"]; onClose: () => void; label: string; sub: string }) {
  return (
    <Link to={to} onClick={onClose} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors">
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium text-ink truncate">{label}</div>
        <div className="text-[11.5px] text-ink-muted truncate">{sub}</div>
      </div>
      <ArrowUpRight size={14} className="text-ink-muted" />
    </Link>
  );
}
