import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell, Reveal } from "@/components/site/PageShell";
import { PRODUCTS, inr } from "@/lib/mock";
import { ArrowUp, Sparkles } from "lucide-react";

type ChatSearch = { q?: string };

export const Route = createFileRoute("/ai-assistant")({
  validateSearch: (search: Record<string, unknown>): ChatSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
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
  "Best 14-inch laptop under ₹100,000 for programming",
  "Sony WH-1000XM6 vs AirPods Pro 3 — which for daily commute?",
  "Should I buy the iPhone 17 Pro now or wait?",
  "OLED monitor for design and coding",
  "A camera for weekend travel — good in low light",
  "Best gaming handheld right now",
];

const STAGES = [
  "Understanding your request",
  "Retrieving live catalog",
  "Reading reviews",
  "Ranking options",
  "Generating recommendation",
];

type Msg = { role: "user" | "assistant"; text: string };

function AIAssistantPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const kickedRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);


  useEffect(() => {
    if (!thinking) return;
    setStage(0);
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 700);
    return () => clearInterval(t);
  }, [thinking]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setError(null);
    setInput("");

    const nextHistory: Msg[] = [...messages, { role: "user", text: t }];
    setMessages([...nextHistory, { role: "assistant", text: "" }]);
    setThinking(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        const errTxt = await res.text().catch(() => "");
        throw new Error(errTxt || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let firstChunk = true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (firstChunk) {
          setThinking(false);
          firstChunk = false;
        }
        setMessages((cur) => {
          const copy = cur.slice();
          copy[copy.length - 1] = { role: "assistant", text: acc };
          return copy;
        });
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message || "Something went wrong. Try again.");
      setMessages((cur) => cur.slice(0, -1));
    } finally {
      setThinking(false);
      abortRef.current = null;
    }
  };

  return (
    <PageShell>
      <section className="relative pt-28 md:pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[10%] -translate-x-1/2 h-[700px] w-[900px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, oklch(0.965 0.025 65 / 0.9), transparent 72%)" }} />
        </div>

        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <div className="eyebrow inline-flex items-center gap-2"><Sparkles size={11} /> PricePilot Intelligence · powered by Groq</div>
          <h1 className="mt-5 display text-[13vw] md:text-[6.5vw] lg:text-[6rem] leading-[0.95] tracking-tight">
            Ask, <span className="italic font-normal text-ink-soft">don't scroll.</span>
          </h1>
          <p className="mt-6 text-[15.5px] text-ink-soft max-w-[52ch] mx-auto leading-relaxed">A shopping conversation, not a search bar. Grounded in live retrieved data — never hallucinated.</p>
        </div>
      </section>

      {/* Chat */}
      <section className="relative mx-auto max-w-[900px] px-4 md:px-0 mt-14">
        <div className="rounded-[36px] border border-line bg-surface overflow-hidden soft-shadow">
          <div ref={scrollRef} className="max-h-[62vh] min-h-[280px] overflow-y-auto px-6 md:px-10 py-8 space-y-8">
            {messages.length === 0 && !thinking && (
              <div className="text-center py-10">
                <div className="text-[13px] text-ink-muted">Start a conversation — try a prompt below.</div>
              </div>
            )}
            {messages.map((m, i) => (
              <Reveal key={i} delay={0}>
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-ink text-background text-[14.5px] leading-relaxed">{m.text}</div>
                  </div>
                ) : (
                  <AssistantMessage text={m.text} />
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
                {STAGES[stage]}…
              </div>
            )}
            {error && (
              <div className="text-[13px] text-accent border border-accent/30 bg-accent/5 rounded-2xl px-4 py-3">{error}</div>
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
              <button type="submit" disabled={thinking || !input.trim()} aria-label="Send" className="grid h-9 w-9 place-items-center rounded-full bg-ink text-background hover:bg-ink/90 transition-colors disabled:opacity-40">
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
            <button key={p} onClick={() => send(p)} disabled={thinking} className="group text-left px-4 py-3 rounded-2xl border border-line hover:border-ink/50 hover:bg-surface-2 transition-all text-[13.5px] text-ink disabled:opacity-50">
              {p}
            </button>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function AssistantMessage({ text }: { text: string }) {
  const { body, picks, sources } = parseAssistant(text);
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted mb-2">
        <Sparkles size={11} className="text-accent" /> PricePilot
      </div>
      <div className="text-[15.5px] leading-relaxed text-ink whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
      {sources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-line text-[11px] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {s}
            </span>
          ))}
        </div>
      )}
      {picks.length > 0 && (
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {picks.map((id) => {
            const p = PRODUCTS.find((x) => x.id === id);
            if (!p) return null;
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
  );
}

function parseAssistant(raw: string) {
  const picks: string[] = [];
  let body = raw.replace(/\[\[PICK:([a-z0-9-]+)\]\]/gi, (_, id) => {
    if (!picks.includes(id)) picks.push(id);
    return "";
  });
  let sources: string[] = [];
  const srcMatch = body.match(/(^|\n)\s*sources?\s*[:\-]\s*(.+)$/i);
  if (srcMatch) {
    sources = srcMatch[2]
      .split(/[,;]/)
      .map((s) => s.trim().replace(/[.\s]+$/, ""))
      .filter(Boolean)
      .slice(0, 6);
    body = body.slice(0, srcMatch.index).trimEnd();
  }
  return { body: body.trim(), picks: picks.slice(0, 3), sources };
}

function renderMarkdown(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>')
    .replace(/\n{2,}/g, "</p><p class='mt-3'>")
    .replace(/^/, "<p>")
    .concat("</p>");
}
