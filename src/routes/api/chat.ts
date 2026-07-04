import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/mock";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function catalog() {
  return PRODUCTS.map(
    (p) =>
      `- id=${p.id} | ${p.brand} ${p.name} | ${p.category} | price=₹${p.price} | mrp=₹${p.mrp} | 90d-low=₹${p.lowest} | rating=${p.rating}/5 | verdict=${p.verdict}`,
  ).join("\n");
}

const SYSTEM = `You are PricePilot — an AI shopping copilot. You are Perplexity for shopping, NOT a chatbot.

STRICT RULES — NEVER VIOLATE:
1. Ground every claim in the RETRIEVED CATALOG below. Never invent prices, specs, ratings, deals, retailers or sources.
2. If a product is not in the catalog, say "I don't have live data on that yet" — do not fabricate.
3. Prices are in Indian Rupees (₹). Use exact numbers from the catalog only.
4. Be honest, concise, editorial — like a premium magazine, not a bot.

RESPONSE FORMAT:
- Open with a 1-sentence direct answer to their question.
- Follow with 2–4 short paragraphs of reasoning (why, tradeoffs, who it suits).
- Use **bold** for product names and key numbers.
- When recommending products, append inline tokens like [[PICK:product-id]] using ONLY ids from the catalog. Max 3 picks.
- End with a "Sources:" line listing 3–5 real domains you'd cite (rtings.com, notebookcheck.net, amazon.in, flipkart.com, reddit.com/r/...). Format: "Sources: a, b, c".

RETRIEVED CATALOG (live pricing snapshot):
${catalog()}

The four questions you help with: What should I buy? Which is best? Where is it cheapest? Buy now or wait?`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return new Response("Missing GROQ_API_KEY", { status: 500 });

        let body: { messages?: Msg[] };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (!messages.length) return new Response("No messages", { status: 400 });

        const upstream = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            stream: true,
            temperature: 0.4,
            messages: [{ role: "system", content: SYSTEM }, ...messages],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          return new Response(`Groq error: ${upstream.status} ${text}`, { status: 502 });
        }

        // Transform OpenAI-style SSE into plain text stream of delta content.
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const reader = upstream.body!.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let buf = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  const l = line.trim();
                  if (!l.startsWith("data:")) continue;
                  const data = l.slice(5).trim();
                  if (!data || data === "[DONE]") continue;
                  try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch {
                    /* ignore */
                  }
                }
              }
            } catch (e) {
              controller.error(e);
              return;
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
