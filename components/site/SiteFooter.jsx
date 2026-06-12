import Image from "next/image";
import SocialIcons from "@/components/site/SocialIcons";

export const SETTINGS_DEFAULT = {
  footer_quote: "Dieu nous aime, et le mal ne l'emportera pas !",
  contact_email: "inscription.pelesaintmichel@gmail.com",
};

const colStyle = { display: "flex", flexDirection: "column", gap: 9 };
const linkStyle = { fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-on-deep-muted)", textDecoration: "none" };
const headStyle = { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: 4 };
const headLinkStyle = { ...headStyle, textDecoration: "none", display: "inline-block" };

/**
 * Pied de page. Les colonnes de navigation sont générées automatiquement à
 * partir du menu (`nav`) : chaque rubrique ayant des sous-rubriques devient une
 * colonne, et les rubriques simples sont regroupées dans une colonne « Navigation ».
 * Tout ajout / modification / suppression dans le menu (BO) se répercute ici.
 */
export default function SiteFooter({ settings = SETTINGS_DEFAULT, socialLinks, nav = [] }) {
  const s = { ...SETTINGS_DEFAULT, ...(settings || {}) };
  const items = nav || [];
  const withChildren = items.filter((it) => it.children && it.children.length > 0);
  const flat = items.filter((it) => !it.children || it.children.length === 0);

  return (
    <footer id="contact" style={{ background: "var(--navy-900)", color: "var(--fg-on-deep)", padding: "56px 32px 36px" }}>
      <div className="pele-grid-footer" style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="pele-footer-brand-col">
          <Image src="/img/logo-medallion-cream.png" alt="" width={76} height={76} style={{ height: 76, width: "auto", marginBottom: 16 }} />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.5, color: "var(--fg-on-deep)", margin: 0, fontStyle: "italic" }}>
            « {s.footer_quote} »
          </p>
          {s.contact_email && (
            <a href={`mailto:${s.contact_email}`} style={{ ...linkStyle, display: "inline-block", marginTop: 14 }}>
              {s.contact_email}
            </a>
          )}
          <div style={{ marginTop: 18 }}>
            <SocialIcons links={socialLinks} />
          </div>
        </div>

        {withChildren.map((rub) => (
          <nav key={rub.id} style={colStyle} aria-label={rub.label}>
            <a style={headLinkStyle} href={rub.href || "#"}>{rub.label}</a>
            {rub.children.map((c, i) => (
              <a key={i} style={linkStyle} href={c.href || "#"}>{c.label}</a>
            ))}
          </nav>
        ))}

        {flat.length > 0 && (
          <nav style={colStyle} aria-label="Navigation">
            <div style={headStyle}>Navigation</div>
            {flat.map((it) => (
              <a key={it.id} style={linkStyle} href={it.href || "#"}>{it.label}</a>
            ))}
          </nav>
        )}
      </div>
      <div style={{ maxWidth: 1180, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid var(--line-on-deep)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-on-deep-muted)" }}>
          Association Pèlerinage de saint Michel · avec le soutien du Sanctuaire du Mont-Saint-Michel
        </span>
        <nav aria-label="Liens légaux" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="/a-propos" style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-on-deep-muted)", textDecoration: "none" }}>À propos</a>
          <a href="/contact" style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-on-deep-muted)", textDecoration: "none" }}>Contact</a>
          <a href="/mentions-legales" style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-on-deep-muted)", textDecoration: "none" }}>Mentions légales</a>
        </nav>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--gold-500)", letterSpacing: "0.1em" }}>
          ✦ Du 8 au 10 mai 2026
        </span>
      </div>
    </footer>
  );
}
