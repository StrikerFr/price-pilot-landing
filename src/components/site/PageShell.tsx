import { useState, useEffect, type ReactNode } from "react";
import { CommandPalette, SiteNav } from "./SiteNav";
import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/lib/nav";
import { ArrowUpRight } from "lucide-react";

/**
 * PageShell wraps every non-landing page with the shared navbar, command
 * palette, and a subtle page-reveal transition. Landing keeps its own chrome.
 */
export function PageShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
      <main
        className={`transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          entered ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-3 blur-[6px]"
        }`}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line bg-background">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-background text-[11px] font-semibold">P</span>
              <span className="display text-xl">PricePilot</span>
            </Link>
            <p className="mt-4 max-w-[42ch] text-[13.5px] text-ink-muted leading-relaxed">
              An AI shopping copilot. We find the best products, compare prices across every store, and tell you exactly when to buy.
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="eyebrow mb-4">Explore</div>
            <ul className="grid grid-cols-2 gap-y-2 text-[13px]">
              {NAV_ITEMS.map((n) => (
                <li key={n.label}><Link to={n.to} className="text-ink-soft hover:text-ink link-underline">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow mb-4">Get alerts</div>
            <p className="text-[12.5px] text-ink-muted mb-3">Weekly, curated. Never noisy.</p>
            <div className="flex items-center gap-2 rounded-full border border-line pl-4 pr-1 h-10">
              <input placeholder="you@domain.com" className="flex-1 bg-transparent outline-none text-[13px]" />
              <button className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-ink text-background text-[12px] font-medium">
                Subscribe <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-[11.5px] text-ink-muted">
          <div>© {new Date().getFullYear()} PricePilot. All prices in ₹ unless noted.</div>
          <div className="flex gap-5">
            <span className="hover:text-ink cursor-pointer">Privacy</span>
            <span className="hover:text-ink cursor-pointer">Terms</span>
            <span className="hover:text-ink cursor-pointer">Press</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------- Shared editorial atoms ------------------------ */

export function EditorialHero({
  kicker,
  title,
  lede,
  right,
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[70%] top-[30%] -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, oklch(0.965 0.025 65 / 0.85), transparent 72%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow">{kicker}</div>
            <h1 className="mt-4 display text-[11vw] sm:text-[10vw] md:text-[7.5vw] lg:text-[6.4rem] leading-[0.95] tracking-tight text-balance">
              {title}
            </h1>
            {lede && <p className="mt-5 sm:mt-6 max-w-[52ch] text-[14.5px] sm:text-[15px] md:text-[17px] text-ink-soft leading-relaxed">{lede}</p>}
          </div>
          {right && <div className="md:col-span-4">{right}</div>}
        </div>
      </div>
    </section>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={className} style={{ animation: `reveal-up 0.9s cubic-bezier(0.2,0.8,0.2,1) both`, animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
