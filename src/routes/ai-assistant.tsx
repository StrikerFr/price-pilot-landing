import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell, Reveal } from "@/components/site/PageShell";
import { PRODUCTS, inr } from "@/lib/mock";
import { ArrowUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — PricePilot" },
      { name: "description", content: "Ask, don't scroll. Have a real conversation about what you want to buy. PricePilot researches, compares and answers straight." },
      { property: "og:title", content: "AI Assistant — PricePilot" },
      { property: "og:description", content: "Ask anything about shopping. The AI copilot that reads reviews, watches prices, and gives you a straight answer." },
    ],
  }),
  component: AIAssistantPage,
});

const SUGGESTED = [
  "Best 14-inch laptop under ₹90,000 for programming",
  "Sony WH-1000XM6 vs Bose QuietComfort Ultra — which one for daily commute?",
  "Should I wait for the Pixel 11 or buy the 10 today?",
  "OLED monitor under ₹80,000 for design and coding",
  "A camera for weekend travel — good in low light, easy to carry",
  "Best gaming laptop deals right now, RTX 5070 or above",
];

const RECENT = [
  "Compared MacBook Air M3 vs Zenbook S16",
  "Wireless earbuds under ₹15,000",
  "Best 4K TV for a well-lit room",
];

type Msg =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; sources?: string[]; picks?: string[] };

const SEED_CONV: Msg[] = [
  { role: "user", text: "Best 14-inch laptop under ₹90,000 for programming" },
  {
    role: "assistant",
    text: "For programming under ₹90,000, the pick is the **MacBook Air M3**. It gives you the best battery on this list (18h real-world), silent fanless operation, and Xcode/Docker/Node all behave. If you need Windows or a discrete GPU, the ASUS Zenbook 14 OLED (Ultra 7 155H) is the runner-up at ₹86,990.",
    sources: ["notebookcheck.net", "rtings.com", "amazon.in", "flipkart.com"],
    picks: ["macbook-air-m3", "iphone-17-pro"],
  },
];

function AIAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(SEED_CONV);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Here's my quick take on "${t}". Based on 4,300+ verified sources and today's live pricing, the standout right now is **${PRODUCTS[0].name}**. It's currently at its 90-day low, review sentiment is consistently strong, and it comfortably beats its rivals on total cost of ownership across a two-year window.`,
          sources: ["rtings.com", "notebookcheck.net", "amazon.in", "reddit.com/r/buildapc"],
          picks: [PRODUCTS[0].id, PRODUCTS[2].id],
        },
      ]);
      setThinking(false);
    }, 900);
  };

  return (
    <PageShell>
      <section className="relative pt-28 md:pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[10%] -translate-x-1/2 h-[700px] w-[900px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, oklch(0.965 0.025 65 / 0.9), transparent 72%)" }} />
        </div>

        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <div className="eyebrow inline-flex items-center gap-2"><Sparkles size={11} /> PricePilot Intelligence</div>
          <h1 className="mt-5 display text-[13vw] md:text-[6.5vw] lg:text-[6rem] leading-[0.95] tracking-tight">
            Ask, <span className="italic font-normal text-ink-soft">don't scroll.</span>
          </h1>
          <p className="mt-6 text-[15.5px] text-ink-soft max-w-[52ch] mx-auto leading-relaxed">A shopping conversation, not a search bar. Compare products, read the reviews for you, watch prices — and answer straight.</p>
        </div>
      </section>

      {/* Chat */}
      <section className="relative mx-auto max-w-[900px] px-4 md:px-0 mt-14">
        <div className="rounded-[36px] border border-line bg-surface overflow-hidden soft-shadow">
          <div ref={scrollRef} className="max-h-[62vh] overflow-y-auto px-6 md:px-10 py-8 space-y-8">
            {messages.map((m, i) => (
              <Reveal key={i} delay={0}>
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-ink text-background text-[14.5px] leading-relaxed">{m.text}</div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted mb-2"><Sparkles size={11} className="text-accent" /> PricePilot</div>
                    <div className="text-[15.5px] leading-relaxed text-ink" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }} />
                    {m.sources && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {m.sources.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-line text-[11px] text-ink-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {m.picks && (
                      <div className="mt-5 grid sm:grid-cols-2 gap-3">
                        {m.picks.map((id) => {
                          const p = PRODUCTS.find((x) => x.id === id)!;
                          return (
                            <Link key={id} to="/product/$id" params={{ id }} className="group flex items-center gap-3 p-3 rounded-2xl border border-line hover:border-ink/40 hover:bg-surface-2 transition-all">
                              <img src={p.img} alt="" className="h-12 w-12 rounded-lg object-cover bg-surface-2" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold truncate">{p.name}</div>
                                <div className="text-[11px] text-ink-muted">{p.category} · {inr(p.price)}</div>
                              </div>
                              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-[oklch(0.42_0.14_45)]">{p.verdict}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Reveal>
            ))}
            {thinking && (
              <div className="text-[13px] text-ink-muted flex items-center gap-2">
                <Sparkles size={12} className="text-accent animate-pulse" />
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: "120ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: "240ms" }} />
                </span>
                Reading reviews & checking live prices…
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-line p-4 md:p-5 bg-background"
          >
            <div className="flex items-end gap-3 rounded-2xl border border-line px-4 py-3 focus-within:border-ink transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={1}
                placeholder="Ask anything — a product, a comparison, a buying question…"
                className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-relaxed placeholder:text-ink-muted min-h-[24px] max-h-40"
              />
              <button type="submit" aria-label="Send" className="grid h-9 w-9 place-items-center rounded-full bg-ink text-background hover:bg-ink/90 transition-colors">
                <ArrowUp size={16} strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Suggested prompts */}
      <section className="mx-auto max-w-[900px] px-4 md:px-0 mt-12">
        <div className="eyebrow mb-4">Try asking</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {SUGGESTED.map((p) => (
            <button key={p} onClick={() => send(p)} className="group text-left px-4 py-3 rounded-2xl border border-line hover:border-ink/50 hover:bg-surface-2 transition-all text-[13.5px] text-ink">
              {p}
            </button>
          ))}
        </div>

        <div className="eyebrow mt-10 mb-3">Recent</div>
        <div className="flex flex-wrap gap-2">
          {RECENT.map((r) => (
            <button key={r} className="px-3 py-1.5 rounded-full border border-line text-[12px] text-ink-soft hover:text-ink hover:border-ink transition-all">{r}</button>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function renderMarkdown(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>');
}
