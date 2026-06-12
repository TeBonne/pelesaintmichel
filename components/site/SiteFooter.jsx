import Image from "next/image";
import SocialIcons from "@/components/site/SocialIcons";

export const SETTINGS_DEFAULT = {
  footer_quote: "Dieu nous aime, et le mal ne l'emportera pas !",
  contact_email: "inscription.pelesaintmichel@gmail.com",
};

const colStyle = { display: "flex", flexDirection: "column", gap: 9 };
const linkStyle = { fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-on-deep-muted)", textDecoration: "none" };
const headStyle = { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: 4 };

export default function SiteFooter({ settings = SETTINGS_DEFAULT, socialLinks }) {
  const s = { ...SETTINGS_DEFAULT, ...(settings || {}) };
  return (
    <footer id="contact" style={{ background: "var(--navy-900)", color: "var(--fg-on-deep)", padding: "56px 32px 36px" }}>
      <div className="pele-grid-footer" style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="pele-footer-brand-col">
          <Image src="/img/logo-medallion-cream.png" alt="" width={76} height={76} style={{ height: 76, width: "auto", marginBottom: 16 }} />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.5, color: "var(--fg-on-deep)", margin: 0, fontStyle: "italic" }}>
            « {s.footer_quote} »
          </p>
          <div style={{ marginTop: 18 }}>
            <SocialIcons links={socialLinks} />
          </div>
        </div>
        <nav style={colStyle} aria-label="Le pèlerinage">
          <div style={headStyle}>Le pèlerinage</div>
          <a style={linkStyle} href="/le-pelerinage">Présentation</a>
          <a style={linkStyle} href="#sec-prog">Programme</a>
          <a style={linkStyle} href="#inscription">Devenir miquelot</a>
          <a style={linkStyle} href="#sec-faq">FAQ 2026</a>
        </nav>
        <nav style={colStyle} aria-label="Prier & se former">
          <div style={headStyle}>Prier & se former</div>
          <a style={linkStyle} href="/prier#priere">Prier saint Michel</a>
          <a style={linkStyle} href="/prier#anges">Les anges</a>
          <a style={linkStyle} href="/prier#chapelet">Le chapelet</a>
          <a style={linkStyle} href="/prier#neuvaine">La neuvaine</a>
        </nav>
        <nav style={colStyle} aria-label="Ressources">
          <div style={headStyle}>Ressources</div>
          <a style={linkStyle} href="#sec-videos">Vidéos</a>
          <a style={linkStyle} href="/ressources#photos">Photos</a>
          <a style={linkStyle} href="/ressources#documents">Documents PDF</a>
          <a style={linkStyle} href="/ressources#newsletters">Newsletters</a>
        </nav>
        <nav style={colStyle} aria-label="Nous contacter">
          <div style={headStyle}>Nous contacter</div>
          <a style={linkStyle} href={`mailto:${s.contact_email}`}>Nous écrire</a>
          <a style={linkStyle} href="/nous-soutenir">Faire un don</a>
          <a style={linkStyle} href="/boutique">Boutique</a>
        </nav>
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
