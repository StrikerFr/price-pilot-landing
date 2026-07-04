import { PRODUCTS, type Product } from "@/lib/mock";

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Laptops: ["laptop", "laptops", "notebook", "macbook", "ultrabook", "chromebook", "programming laptop", "coding laptop"],
  Smartphones: ["phone", "phones", "smartphone", "smartphones", "iphone", "android", "pixel", "mobile", "mobiles"],
  Audio: ["headphone", "headphones", "earbud", "earbuds", "earphone", "iem", "airpods", "audio", "speaker", "speakers"],
  Monitors: ["monitor", "monitors", "display", "screen", "oled monitor"],
  Gaming: ["gaming handheld", "handheld", "steam deck", "console", "consoles"],
  Keyboards: ["keyboard", "keyboards", "keycap", "mechanical keyboard"],
  Mice: ["mouse", "mice", "gaming mouse", "wireless mouse"],
  Mousepads: ["mousepad", "mouse pad", "desk mat", "deskmat"],
  Smartwatches: ["watch", "watches", "smartwatch", "smartwatches", "wearable"],
  Cameras: ["camera", "cameras", "mirrorless", "dslr", "point and shoot"],
};

const LINK_FOLLOWUP_RE = /^(give|show|send|share|need|want)?\s*(me\s*)?(the\s*)?(links?|prices?|stores?|where\s*(to)?\s*buy|buy\s*links?|best\s*price|cheapest)(\s*(please|pls|now|for\s*these|of\s*all|all))?\s*[.!?]*$/i;

function clean(text: string) {
  return text.toLowerCase().replace(/[₹,]/g, "").replace(/\s+/g, " ").trim();
}

function compact(text: string) {
  return clean(text).replace(/[^a-z0-9]+/g, "");
}

export function extractPriceCap(query: string): number | null {
  const q = clean(query);
  const match = q.match(/(?:under|below|less than|upto|up to|within|budget|<=|<)\s*(\d+(?:\.\d+)?)\s*(k|lakh|lac|l)?\s*(?:rs|rupees?)?\b/i);
  if (!match) return null;
  let cap = Number(match[1]);
  if (!Number.isFinite(cap) || cap <= 0) return null;
  const unit = (match[2] || "").toLowerCase();
  if (unit === "k") cap *= 1000;
  if (unit === "lakh" || unit === "lac" || unit === "l") cap *= 100000;
  return Math.round(cap);
}

export function isLinkRequest(query: string) {
  return LINK_FOLLOWUP_RE.test(query.trim());
}

export function getRequestedCategories(query: string) {
  const q = clean(query);
  return Object.entries(CATEGORY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => q.includes(keyword)))
    .map(([category]) => category);
}

function productText(product: Product) {
  return `${product.brand} ${product.name} ${product.category}`;
}

function productNameHit(product: Product, query: string) {
  const q = compact(query);
  const brand = compact(product.brand);
  const name = compact(product.name);
  const id = compact(product.id);
  if (brand && q.includes(brand)) return true;
  if (name && q.includes(name)) return true;
  if (id && q.includes(id)) return true;
  return product.name
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .some((token) => clean(query).includes(token.toLowerCase()));
}

export function hasShoppingIntent(query: string) {
  if (!query.trim() || isLinkRequest(query)) return false;
  return getRequestedCategories(query).length > 0 || PRODUCTS.some((product) => productNameHit(product, query));
}

export function isProductRelevant(product: Product, query: string): boolean {
  const categories = getRequestedCategories(query);
  const categoryHit = categories.length > 0 && categories.includes(product.category);
  const nameHit = productNameHit(product, query);
  if (!categoryHit && !nameHit) return false;

  const cap = extractPriceCap(query);
  if (cap !== null && product.price > cap) return false;
  return true;
}

function scoreProduct(product: Product, query: string) {
  const cap = extractPriceCap(query);
  const savingsRatio = product.mrp > 0 ? Math.max(0, product.mrp - product.price) / product.mrp : 0;
  let score = product.rating * 20 + savingsRatio * 35;
  if (product.verdict === "Great time") score += 8;
  if (product.verdict === "Buy now") score += 6;
  if (productNameHit(product, query)) score += 24;
  if (cap) {
    const budgetUse = product.price / cap;
    if (budgetUse >= 0.45 && budgetUse <= 1) score += budgetUse * 10;
    if (budgetUse < 0.35) score -= 4;
  }
  const q = clean(query);
  productText(product)
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 3)
    .forEach((token) => {
      if (q.includes(token)) score += 2;
    });
  return score;
}

export function getCatalogMatches(query: string, max = 3) {
  if (!hasShoppingIntent(query)) return [];
  return PRODUCTS.filter((product) => isProductRelevant(product, query))
    .sort((a, b) => scoreProduct(b, query) - scoreProduct(a, query))
    .slice(0, max);
}

export function findBestShoppingQuery(texts: string[]) {
  for (let i = texts.length - 1; i >= 0; i--) {
    const text = texts[i]?.trim() ?? "";
    if (!text || isLinkRequest(text)) continue;
    if (hasShoppingIntent(text)) return text;
  }
  return texts.find((text) => hasShoppingIntent(text)) ?? "";
}