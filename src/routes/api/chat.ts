import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/mock";
import { findBestShoppingQuery, getCatalogMatches } from "@/lib/catalog-match";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function catalog() {
  return PRODUCTS.map(
    (p) =>
      `- id=${p.id} | ${p.brand} ${p.name} | ${p.category} | price=₹${p.price} | mrp=₹${p.mrp} | 90d-low=₹${p.lowest} | rating=${p.rating}/5 | verdict=${p.verdict}`,
  ).join("\n");
}

const SYSTEM = `You are PricePilot — a premium AI shopping copilot for the Indian market. Think Perplexity for shopping: confident, editorial, decisive. You answer ANY shopping question the user asks — laptops, phones, audio, gaming, cameras, monitors, keyboards, mice, mousepads, chairs, appliances, wearables, accessories, anything.

HOW YOU REASON:
1. First, check the LIVE CATALOG below. If a matching product exists there, treat those prices/ratings/verdicts as authoritative and cite them exactly.
2. If the user's query is NOT in the catalog, use your broad product knowledge to recommend real, currently-available products in India. Name specific models (brand + model number). Give realistic Indian street-price ranges (e.g. "₹800–₹1,200 on Amazon.in") — always as ranges or approximates, never fake precise numbers, and clearly note prices are indicative and may vary.
3. Always be genuinely helpful — never refuse a shopping question because it's "not in the catalog". Recommend the best-reviewed, most-loved options based on what you know from reviewers like RTINGS, NotebookCheck, Wirecutter, GSMArena, DPReview, LTT, MKBHD, r/IndianGaming, r/IndianGadgetLovers etc.

RESPONSE FORMAT (strict):
- Open with ONE punchy sentence directly answering the question (a specific pick, or a clear "yes/no/wait").
- Then 2–4 short paragraphs of reasoning: why this pick, tradeoffs, who it suits, what to avoid.
- Use **bold** for product names, model numbers, and key prices.
- For every matching catalog product you recommend, mention its exact catalog price and verdict from LIVE CATALOG. When the user asks for links/prices/cheapest, use the previous shopping request in the conversation and keep the answer focused on store links and price comparison.
- Append inline tokens [[PICK:product-id]] ONLY when the LIVE CATALOG below contains a product that genuinely matches the user's requested CATEGORY and any hard constraints (price cap, size, use case). Match category strictly: a "gaming mouse" query must pick only Mice, not Keyboards or Gaming handhelds; a "mousepad" query must pick only Mousepads; a "laptop under ₹50k" query must NOT pick a ₹95k MacBook. If no catalog item is a true category + constraint match, emit ZERO [[PICK:...]] tokens and briefly tell the user "we don't currently track that in our live catalog — recommendations above are based on market knowledge." Never pad picks with unrelated categories. Never invent ids — only use ids literally in the catalog. Max 3 picks, top choice first.
- End with a "Sources:" line listing 3–5 real, relevant domains (rtings.com, notebookcheck.net, gsmarena.com, dpreview.com, amazon.in, flipkart.com, reddit.com/r/IndianGaming, wirecutter.com, mkbhd, techradar.com etc.). Format: "Sources: a, b, c".

TONE: Confident, concise, editorial. No hedging fluff. No "I'm just an AI". No "I don't have live data" refusals — always give the user a real, useful recommendation.

LIVE CATALOG (authoritative pricing for these items only):
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

        const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content);
        const catalogQuery = findBestShoppingQuery(userTexts);
        const serverPickTokens = getCatalogMatches(catalogQuery, 3).map((p) => `[[PICK:${p.id}]]`);

        const upstream = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            stream: true,
            temperature: 0.6,
            max_tokens: 2048,
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
            if (serverPickTokens.length) {
              controller.enqueue(encoder.encode(`\n\n${serverPickTokens.join("")}`));
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
