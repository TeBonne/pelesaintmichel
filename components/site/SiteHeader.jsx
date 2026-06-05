"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SocialIcons from "@/components/site/SocialIcons";

/* Menu par défaut (repli si la base est vide). */
const DEFAULT_NAV = [
  { label: "Accueil", href: "/", children: [] },
  {
    label: "Le pèlerinage",
    href: "/le-pelerinage",
    children: [
      { label: "Présentation", href: "/le-pelerinage" },
      { label: "Pour qui ?", href: "/le-pelerinage#pour-qui" },
      { label: "Les chapitres", href: "/le-pelerinage#chapitres" },
      { label: "Histoire & miquelots", href: "/le-pelerinage#histoire" },
    ],
  },
  { label: "Programme", href: "/programme", children: [] },
  {
    label: "Prier",
    href: "/prier",
    children: [
      { label: "Prière à saint Michel", href: "/prier#priere" },
      { label: "Le chapelet de saint Michel", href: "/prier#chapelet" },
      { label: "La neuvaine", href: "/prier#neuvaine" },
      { label: "Les anges", href: "/prier#anges" },
    ],
  },
  { label: "FAQ", href: "/faq", children: [] },
  {
    label: "Ressources",
    href: "/ressources",
    children: [
      { label: "Vidéos", href: "/ressources#videos" },
      { label: "Photos", href: "/ressources#photos" },
      { label: "Documents PDF", href: "/ressources#documents" },
      { label: "Newsletters", href: "/ressources#newsletters" },
    ],
  },
  { label: "Boutique", href: "/boutique", children: [] },
  { label: "Nous soutenir", href: "/nous-soutenir", children: [] },
];

const SEARCH_INDEX = [
  { t: "Accueil", h: "/", k: "accueil pèlerinage mont saint michel" },
  { t: "Le pèlerinage", h: "/le-pelerinage", k: "présentation histoire partenaires équipe" },
  { t: "Programme", h: "/programme", k: "programme déroulé trois jours étapes marche" },
  { t: "Prier", h: "/prier", k: "prière saint michel chapelet neuvaine anges" },
  { t: "FAQ", h: "/faq", k: "faq questions réponses inscription bivouac repas tarifs" },
  { t: "Ressources", h: "/ressources", k: "vidéos photos documents newsletters" },
  { t: "Boutique", h: "/boutique", k: "boutique polo sweat drapeau foulard vêtements" },
  { t: "Nous soutenir", h: "/nous-soutenir", k: "don soutenir bénévole impôt" },
];

function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);
  if (!open) return null;
  const query = q.trim().toLowerCase();
  const results = query.length < 2 ? [] : SEARCH_INDEX.filter((it) => (it.t + " " + it.k).toLowerCase().includes(query)).slice(0, 8);
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(7,18,28,0.86)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "12vh 20px 20px" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(620px, 100%)" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const first = results[0];
            if (first) window.location.href = first.h;
            onClose();
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--ivory)", border: "1px solid var(--gold-500)", borderRadius: "var(--r-md)", padding: "4px 6px 4px 18px", boxShadow: "var(--shadow-lg)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-700)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Taper votre recherche" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: 18, color: "var(--ink)", padding: "12px 0" }} />
          <button type="button" onClick={onClose} aria-label="Fermer" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone-500)", fontSize: 26, padding: "0 10px" }}>
            ×
          </button>
        </form>
        {results.length > 0 && (
          <div style={{ marginTop: 10, background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
            {results.map((r) => (
              <a key={r.h} href={r.h} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", textDecoration: "none", borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--gold-600)", fontSize: 13 }}>✦</span>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 17, color: "var(--navy-700)" }}>{r.t}</span>
              </a>
            ))}
          </div>
        )}
        {query.length >= 2 && results.length === 0 && (
          <div style={{ marginTop: 10, background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "16px 18px", fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-soft)" }}>
            Aucun résultat. Essayez « programme », « inscription », « vidéos »…
          </div>
        )}
      </div>
    </div>
  );
}

const SearchIcon = ({ size = 19 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export default function SiteHeader({ socialLinks, nav, inscriptionUrl, active = "Accueil" }) {
  const navItems = nav && nav.length ? nav : DEFAULT_NAV;
  const inscrHref = inscriptionUrl || "#inscription";
  const inscrExternal = /^https?:\/\//.test(inscrHref);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: scrolled || open ? "rgba(7,34,58,0.97)" : "rgba(7,34,58,0.80)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: `1px solid ${scrolled ? "var(--line-on-deep)" : "rgba(201,164,94,0.18)"}`,
        transition: "all .3s ease",
      }}
    >
      <div className="pele-header-bar">
        <a href="/" aria-label="Pèlerinage de Saint Michel — accueil" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image src="/img/logo-medallion-cream.png" alt="Pèlerinage de Saint Michel" width={54} height={54} priority className="pele-logo-img" />
        </a>

        {/* Navigation bureau */}
        <nav className="pele-nav-desktop" aria-label="Navigation principale">
          {navItems.map((item, i) => {
            const { label, href } = item;
            const subs = item.children && item.children.length ? item.children : null;
            const support = label === "Nous soutenir";
            const on = active === label;
            return (
              <div key={item.id || label} style={{ position: "relative" }} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}>
                <a
                  href={href}
                  aria-current={on ? "page" : undefined}
                  style={{ fontFamily: "var(--font-serif)", fontWeight: support ? 700 : 600, fontSize: 16.5, color: support ? "var(--gold-400)" : on ? "var(--gold-300)" : "var(--gold-100)", textDecoration: "none", whiteSpace: "nowrap", paddingBottom: 5, display: "inline-block", borderBottom: support || on ? "2px solid var(--gold-500)" : "2px solid transparent" }}
                >
                  {label}
                  {subs ? " ›" : ""}
                </a>
                {subs && hoverIdx === i && (
                  <div style={{ position: "absolute", top: "100%", left: -12, paddingTop: 10 }}>
                    <div style={{ background: "var(--navy-800)", border: "1px solid var(--line-on-deep)", borderTop: "2px solid var(--gold-500)", borderRadius: "0 0 var(--r-md) var(--r-md)", boxShadow: "var(--shadow-lg)", padding: "8px 0", minWidth: 224 }}>
                      {subs.map((s) => (
                        <a key={s.label} href={s.href} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 16, color: "var(--gold-100)", textDecoration: "none", padding: "9px 20px", whiteSpace: "nowrap" }}>
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions bureau */}
        <div className="pele-actions-desktop">
          <SocialIcons links={socialLinks} />
          <a href={inscrHref} target={inscrExternal ? "_blank" : undefined} rel={inscrExternal ? "noopener noreferrer" : undefined} className="pele-cta-halo" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--navy-800)", background: "var(--gold-500)", padding: "11px 16px", borderRadius: "var(--r-sm)", textDecoration: "none", whiteSpace: "nowrap" }}>
            S'inscrire
          </a>
          <button onClick={() => setSearchOpen(true)} aria-label="Rechercher" style={{ background: "none", border: "none", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-200)" }}>
            <SearchIcon />
          </button>
        </div>

        {/* Actions mobile */}
        <div className="pele-actions-mobile">
          <button onClick={() => setSearchOpen(true)} aria-label="Rechercher" style={{ background: "none", border: "none", cursor: "pointer", width: 44, height: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-200)" }}>
            <SearchIcon size={24} />
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--gold-200)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <g>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </g>
              ) : (
                <g>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </g>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      {open && (
        <nav className="pele-mobile-menu" aria-label="Navigation principale" style={{ padding: "8px 20px 22px", borderTop: "1px solid var(--line-on-deep)", flexDirection: "column", gap: 2, maxHeight: "75vh", overflowY: "auto" }}>
          {navItems.map((item) => {
            const { label, href } = item;
            const subs = item.children && item.children.length ? item.children : null;
            const support = label === "Nous soutenir";
            return (
              <div key={item.id || label}>
                <a href={href} onClick={() => setOpen(false)} aria-current={active === label ? "page" : undefined} style={{ display: "block", fontFamily: "var(--font-serif)", fontWeight: support ? 700 : 600, fontSize: 19, color: support ? "var(--gold-400)" : active === label ? "var(--gold-300)" : "var(--gold-100)", textDecoration: "none", padding: "11px 4px", borderBottom: "1px solid rgba(201,164,94,0.12)" }}>
                  {label}
                </a>
                {subs && (
                  <div style={{ padding: "2px 0 8px 16px" }}>
                    {subs.map((s) => (
                      <a key={s.label} href={s.href} onClick={() => setOpen(false)} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 16, color: "var(--fg-on-deep-muted)", textDecoration: "none", padding: "7px 4px" }}>
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a href={inscrHref} target={inscrExternal ? "_blank" : undefined} rel={inscrExternal ? "noopener noreferrer" : undefined} onClick={() => setOpen(false)} className="pele-cta-halo" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--navy-800)", background: "var(--gold-500)", padding: "13px 18px", borderRadius: "var(--r-sm)", textDecoration: "none", textAlign: "center", marginTop: 14 }}>
            S'inscrire
          </a>
          <div style={{ marginTop: 16 }}>
            <SocialIcons links={socialLinks} />
          </div>
        </nav>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
