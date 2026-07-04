import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, EditorialHero } from "@/components/site/PageShell";
import { PRODUCTS, inr } from "@/lib/mock";
import { ArrowUpRight, Bell, Heart, Search as SearchIcon, Settings } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PricePilot" },
      { name: "description", content: "Your PricePilot: wishlist, saved searches, price alerts, browsing history and notification preferences." },
      { property: "og:title", content: "Profile — PricePilot" },
      { property: "og:description", content: "Your wishlist, price alerts and shopping intelligence — in one place." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [notif, setNotif] = useState({ drops: true, digest: true, launches: false });
  const wishlist = PRODUCTS.slice(0, 3);
  const alerts = PRODUCTS.slice(3, 6).map((p) => ({ ...p, target: p.price - 4000 }));
  const searches = ["Gaming laptop under ₹90k", "OLED monitor 27 inch", "Noise cancelling headphones"];
  const history = PRODUCTS.slice(2, 8);

  return (
    <PageShell>
      <EditorialHero
        kicker="Your PricePilot"
        title={<>Hi, <span className="italic font-normal text-ink-soft">Aarav.</span></>}
        lede="A quiet workspace for the things you're watching, tracking, and thinking about buying."
      />

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <aside className="md:col-span-3">
          <div className="rounded-3xl border border-line bg-surface p-6 sticky top-24">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-ink text-background display text-xl">A</div>
              <div>
                <div className="text-[14px] font-semibold">Aarav Menon</div>
                <div className="text-[11.5px] text-ink-muted">Member since 2024</div>
              </div>
            </div>
            <div className="mt-6 space-y-1 text-[13px]">
              {[
                { icon: Heart, label: "Wishlist", to: "/wishlist" as const },
                { icon: Bell, label: "Price alerts" },
                { icon: SearchIcon, label: "Saved searches" },
                { icon: Settings, label: "Preferences" },
              ].map((r) =>
                r.to ? (
                  <Link key={r.label} to={r.to} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-surface-2 transition-colors">
                    <span className="flex items-center gap-2 text-ink"><r.icon size={14} /> {r.label}</span>
                    <ArrowUpRight size={13} className="text-ink-muted" />
                  </Link>
                ) : (
                  <button key={r.label} className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-surface-2 transition-colors">
                    <span className="flex items-center gap-2 text-ink"><r.icon size={14} /> {r.label}</span>
                    <ArrowUpRight size={13} className="text-ink-muted" />
                  </button>
                ),
              )}
            </div>
          </div>
        </aside>

        <div className="md:col-span-9 space-y-16">
          <Block title="Wishlist" action={<Link to="/wishlist" className="text-[12.5px] link-underline">See all</Link>}>
            <div className="grid gap-4 md:grid-cols-3">
              {wishlist.map((p) => (
                <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group block rounded-2xl border border-line bg-surface overflow-hidden hover:border-ink/40 transition-all">
                  <div className="aspect-[5/4] bg-surface-2 grid place-items-center"><img src={p.img} alt="" className="h-[70%] w-[70%] object-contain transition-transform duration-700 group-hover:scale-105" /></div>
                  <div className="p-4">
                    <div className="text-[13px] font-semibold truncate">{p.name}</div>
                    <div className="mt-1 display text-lg">{inr(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Block>

          <Block title="Active price alerts">
            <div className="rounded-3xl border border-line bg-surface overflow-hidden">
              {alerts.map((a, i) => (
                <div key={a.id} className={`flex items-center justify-between gap-4 px-6 py-5 ${i !== alerts.length - 1 ? "border-b border-line" : ""}`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={a.img} alt="" className="h-12 w-12 rounded-lg object-cover bg-surface-2" />
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold truncate">{a.name}</div>
                      <div className="text-[11.5px] text-ink-muted">Notify me at {inr(a.target)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="display text-lg">{inr(a.price)}</div>
                    <div className="text-[11px] text-ink-muted">Current</div>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Saved searches">
            <div className="flex flex-wrap gap-2">
              {searches.map((s) => (
                <button key={s} className="px-3.5 py-2 rounded-full border border-line hover:border-ink text-[12.5px] text-ink-soft hover:text-ink transition-all">{s}</button>
              ))}
            </div>
          </Block>

          <Block title="Browsing history">
            <div className="grid gap-3 md:grid-cols-2">
              {history.map((p) => (
                <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group flex items-center gap-3 p-3 rounded-2xl border border-line hover:border-ink/40 hover:bg-surface-2 transition-all">
                  <img src={p.img} alt="" className="h-12 w-12 rounded-lg object-cover bg-surface-2" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{p.name}</div>
                    <div className="text-[11px] text-ink-muted">{p.category}</div>
                  </div>
                  <ArrowUpRight size={13} className="text-ink-muted group-hover:text-ink" />
                </Link>
              ))}
            </div>
          </Block>

          <Block title="Notifications">
            <div className="rounded-3xl border border-line bg-surface overflow-hidden">
              {[
                { k: "drops", label: "Price drops on your wishlist", desc: "Instant email the moment a price hits your target." },
                { k: "digest", label: "Weekly editorial digest", desc: "A quiet Friday roundup of the best drops we saw this week." },
                { k: "launches", label: "New launches in your categories", desc: "Only when something genuinely new appears." },
              ].map((row, i) => (
                <div key={row.k} className={`flex items-center justify-between gap-4 px-6 py-5 ${i !== 2 ? "border-b border-line" : ""}`}>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold">{row.label}</div>
                    <div className="text-[12px] text-ink-muted mt-0.5">{row.desc}</div>
                  </div>
                  <Toggle on={notif[row.k as keyof typeof notif]} onChange={(v) => setNotif({ ...notif, [row.k]: v })} />
                </div>
              ))}
            </div>
          </Block>
        </div>
      </section>
    </PageShell>
  );
}

function Block({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <h3 className="display text-2xl md:text-3xl">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-ink" : "bg-surface-3"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}
