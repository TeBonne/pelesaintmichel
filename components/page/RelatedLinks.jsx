import { SectionWide, SectionHead } from "./Blocks";

/* Carte de maillage interne : description courte de chaque page cible. */
const PAGES = {
  "le-pelerinage": { label: "Le pèlerinage", href: "/le-pelerinage", desc: "Présentation, partenaires, équipe, histoire et miquelots." },
  programme: { label: "Programme", href: "/programme", desc: "Le déroulé des trois jours, de Saint-Malo au Mont." },
  prier: { label: "Prier", href: "/prier", desc: "Prière à saint Michel, chapelet, neuvaine, les anges." },
  faq: { label: "FAQ 2026", href: "/faq", desc: "Toutes les réponses pratiques et spirituelles." },
  ressources: { label: "Ressources", href: "/ressources", desc: "Vidéos, photos, documents et newsletters." },
  boutique: { label: "Boutique", href: "/boutique", desc: "Vêtements, drapeau et foulard du pèlerinage." },
  "nous-soutenir": { label: "Nous soutenir", href: "/nous-soutenir", desc: "Faire un don déductible, devenir bénévole." },
};

/* Pour chaque page, les pages connexes à mettre en avant. */
const RELATED = {
  accueil: ["le-pelerinage", "programme", "prier", "faq", "ressources", "nous-soutenir"],
  "le-pelerinage": ["programme", "prier", "faq"],
  programme: ["le-pelerinage", "prier", "ressources"],
  prier: ["le-pelerinage", "programme", "ressources"],
  faq: ["programme", "le-pelerinage", "nous-soutenir"],
  ressources: ["programme", "prier", "boutique"],
  boutique: ["nous-soutenir", "ressources", "le-pelerinage"],
  "nous-soutenir": ["le-pelerinage", "boutique", "faq"],
  recherche: ["le-pelerinage", "programme", "faq"],
};

export default function RelatedLinks({ current, title = "Pour aller plus loin", overline = "Explorer le site", bg = "var(--parchment-2)" }) {
  const links = (RELATED[current] || []).map((k) => PAGES[k]).filter(Boolean);
  if (!links.length) return null;

  return (
    <SectionWide bg={bg}>
      <SectionHead over={overline} title={title} />
      <div className="pele-grid-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              textDecoration: "none",
              background: "var(--ivory)",
              border: "1px solid var(--line)",
              borderLeft: "3px solid var(--gold-500)",
              borderRadius: "var(--r-md)",
              padding: "20px 22px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20, color: "var(--navy-700)" }}>
              {l.label} <span style={{ color: "var(--gold-600)" }}>→</span>
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.5, color: "var(--ink-soft)" }}>{l.desc}</span>
          </a>
        ))}
      </div>
    </SectionWide>
  );
}
