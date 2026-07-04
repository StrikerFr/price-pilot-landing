export const NAV_ITEMS = [
  { label: "Deals", to: "/deals" },
  { label: "Categories", to: "/categories" },
  { label: "Compare", to: "/compare" },
  { label: "Price Drops", to: "/price-drops" },
  { label: "Sales Calendar", to: "/sales-calendar" },
  { label: "News", to: "/news" },
  { label: "AI Assistant", to: "/ai-assistant" },
] as const;

export type NavPath = (typeof NAV_ITEMS)[number]["to"];
