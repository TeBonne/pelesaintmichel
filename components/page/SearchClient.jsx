"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const INDEX = [
  { t: "Accueil", h: "/", k: "accueil pèlerinage mont saint michel" },
  { t: "Le pèlerinage — Présentation", h: "/le-pelerinage", k: "présentation mission histoire partenaires équipe évêque" },
  { t: "Pour qui ?", h: "/le-pelerinage#pour-qui", k: "famille enfants adultes participer baptisé" },
  { t: "Les chapitres", h: "/le-pelerinage#chapitres", k: "chapitre chef de chapitre groupe paroisse" },
  { t: "Histoire & miquelots", h: "/le-pelerinage#histoire", k: "histoire miquelot plomb chemins du paradis" },
  { t: "Programme", h: "/programme", k: "programme déroulé trois jours étapes horaires marche bivouac" },
  { t: "Prier", h: "/prier", k: "prière saint michel léon xiii chapelet neuvaine anges hozanna" },
  { t: "FAQ 2026", h: "/faq", k: "faq questions réponses inscription transport bivouac repas tarifs cars" },
  { t: "Ressources — Vidéos", h: "/ressources#videos", k: "vidéos youtube films chaîne" },
  { t: "Ressources — Photos", h: "/ressources#photos", k: "photos galerie diaporama images" },
  { t: "Ressources — Documents PDF", h: "/ressources#documents", k: "documents pdf affiche livret programme télécharger" },
  { t: "Ressources — Newsletters", h: "/ressources#newsletters", k: "newsletter lettre actualités" },
  { t: "Boutique", h: "/boutique", k: "boutique polo sweat drapeau foulard vêtements précommande prix" },
  { t: "Nous soutenir", h: "/nous-soutenir", k: "don soutenir bénévole faire un don déductible impôt" },
];

export default function SearchClient() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const query = q.trim().toLowerCase();
  const results = query.length < 2 ? [] : INDEX.filter((it) => (it.t + " " + it.k).toLowerCase().includes(query));

  return (
    <div>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--ivory)", border: "1px solid var(--gold-500)", borderRadius: "var(--r-md)", padding: "4px 6px 4px 18px", boxShadow: "var(--shadow-sm)", maxWidth: 620 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-700)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Taper votre recherche"
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: 18, color: "var(--ink)", padding: "12px 6px" }}
        />
      </form>

      {query.length >= 2 && (
        <div style={{ marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--stone-500)" }}>
          {results.length} résultat{results.length > 1 ? "s" : ""} pour « {q.trim()} »
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r) => (
            <a key={r.h} href={r.h} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "var(--ivory)", border: "1px solid var(--line)", borderLeft: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", textDecoration: "none", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ color: "var(--gold-600)", fontSize: 14 }}>✦</span>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)" }}>{r.t}</span>
            </a>
          ))}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && (
        <div style={{ marginTop: 16, fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-soft)" }}>
          Aucun résultat. Essayez « programme », « inscription », « boutique »…
        </div>
      )}
      {query.length < 2 && (
        <div style={{ marginTop: 16, fontFamily: "var(--font-body)", fontSize: 15, color: "var(--stone-500)" }}>
          Saisissez au moins 2 caractères pour lancer la recherche.
        </div>
      )}
    </div>
  );
}
