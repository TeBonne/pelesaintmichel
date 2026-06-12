import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, Section, Prose } from "@/components/page/Blocks";
import Breadcrumb from "@/components/page/Breadcrumb";

/** Gabarit d'une page simple (À propos / Mentions légales / Contact) : héros + corps de texte. */
export default function SimplePageView({ page, nav, settings, current, path, showContact }) {
  const p = page || {};
  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={settings?.inscription_url} />
      <main id="contenu">
        <Breadcrumb current={current} path={path} />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />
        <Section>
          {p.body && <Prose text={p.body} />}
          {showContact && settings?.contact_email && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "var(--ink)", marginTop: p.body ? 24 : 0 }}>
              Écrivez-nous :{" "}
              <a href={`mailto:${settings.contact_email}`} style={{ color: "var(--navy-600)", fontWeight: 600 }}>
                {settings.contact_email}
              </a>
            </p>
          )}
        </Section>
      </main>
      <SiteFooter settings={settings} socialLinks={settings} />
    </>
  );
}
