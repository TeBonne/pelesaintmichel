"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";

const GROUPS = [
  {
    group: null,
    items: [{ href: "/admin", label: "Tableau de bord", exact: true }],
  },
  {
    group: "Pages",
    items: [
      { href: "/admin/accueil", label: "Accueil" },
      { href: "/admin/le-pelerinage", label: "Le pèlerinage" },
      { href: "/admin/programme", label: "Programme" },
      { href: "/admin/prier", label: "Prier" },
      { href: "/admin/faq", label: "FAQ" },
      { href: "/admin/ressources", label: "Ressources" },
      { href: "/admin/boutique", label: "Boutique" },
      { href: "/admin/nous-soutenir", label: "Nous soutenir" },
      { href: "/admin/recherche", label: "Recherche" },
    ],
  },
  {
    group: "Pages annexes",
    items: [
      { href: "/admin/a-propos", label: "À propos" },
      { href: "/admin/contact", label: "Contact" },
      { href: "/admin/mentions-legales", label: "Mentions légales" },
    ],
  },
  {
    group: "Apparence",
    items: [
      { href: "/admin/menu", label: "Menu (en-tête)" },
      { href: "/admin/reglages", label: "Réglages & pied de page" },
    ],
  },
  {
    group: "Administration",
    adminOnly: true,
    items: [
      { href: "/admin/utilisateurs", label: "Éditeurs & droits" },
      { href: "/admin/journal", label: "Journal d'activité" },
    ],
  },
];

export default function AdminChrome({ title, email, isAdmin, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (it) => (it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(it.href + "/"));

  return (
    <div className="adm-layout">
      <div className={`adm-backdrop${open ? " adm-open" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`adm-sidebar${open ? " adm-open" : ""}`}>
        <a href="/admin" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 18px 14px", textDecoration: "none", borderBottom: "1px solid var(--line-on-deep)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo-medallion-cream.png" alt="" style={{ height: 38 }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, letterSpacing: "0.04em", color: "var(--gold-200)", lineHeight: 1.2 }}>
            Administration
          </span>
        </a>

        <nav style={{ flex: 1, padding: "6px 0 16px" }}>
          {GROUPS.filter((g) => !g.adminOnly || isAdmin).map((g, gi) => (
            <div key={gi}>
              {g.group && <div className="adm-navgroup">{g.group}</div>}
              {g.items.map((it) => (
                <a key={it.href} href={it.href} onClick={() => setOpen(false)} className={`adm-navlink${isActive(it) ? " adm-active" : ""}`} aria-current={isActive(it) ? "page" : undefined}>
                  {it.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line-on-deep)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--fg-on-deep-muted)", marginBottom: 8, wordBreak: "break-all" }}>
            {email} {isAdmin ? "· admin" : "· éditeur"}
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-300)", textDecoration: "none", marginBottom: 8 }}>
            Voir le site ↗
          </a>
          <form action={signOut}>
            <button style={{ width: "100%", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--gold-100)", background: "rgba(201,164,94,0.16)", border: "1px solid var(--line-on-deep)", borderRadius: "var(--r-sm)", padding: "8px 14px", cursor: "pointer" }}>
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="adm-main">
        <div className="adm-topbar">
          <button className="adm-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-700)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22, color: "var(--navy-700)", margin: 0 }}>{title}</h1>
        </div>
        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}
