import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, SubNav, Section, SectionWide, SectionHead, Prose, CtaBand, InfoCard } from "@/components/page/Blocks";
import Gallery from "@/components/page/Gallery";
import { getPelerinageContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getPelerinageContent();
  return pageMeta({
    title: page?.meta_title || "Le pèlerinage — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/le-pelerinage",
    image: page?.hero_image_url,
  });
}

const SUB = [
  ["Présentation", "#presentation"],
  ["Nos partenaires", "#partenaires"],
  ["L'équipe", "#equipe"],
  ["En images", "#diaporama"],
  ["Pour qui ?", "#pour-qui"],
  ["Les chapitres", "#chapitres"],
  ["Histoire", "#histoire"],
];

function Partner({ nom, tag, logo_url, description }) {
  return (
    <div style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", background: "#fff", borderBottom: "1px solid var(--line)", height: 120 }}>
        {logo_url && <Image src={logo_url} alt={nom} fill sizes="(max-width: 820px) 100vw, 520px" style={{ objectFit: "contain", padding: "20px 28px" }} />}
      </div>
      <div style={{ padding: "20px 26px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: "var(--navy-700)" }}>{nom}</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)" }}>{tag}</div>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.55, color: "var(--ink-soft)", margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

export default async function PelerinagePage() {
  const { page, cards, partners, gallery, nav, settings } = await getPelerinageContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;
  const quoteParas = (p.eveque_quote || "").split(/\n\s*\n/).filter((x) => x.trim());

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="Le pèlerinage" />
      <main id="contenu">
        <Breadcrumb current="Le pèlerinage" path="/le-pelerinage" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />
        <SubNav items={SUB} active="Présentation" />

        <Section id="presentation">
          <SectionHead over={p.presentation_overline} title={p.presentation_title} />
          <Prose text={p.presentation_body} />
          <div className="pele-grid-3" style={{ marginTop: 26 }}>
            {(cards || []).map((c) => (
              <InfoCard key={c.id} icon={null} title={c.title} text={c.text} />
            ))}
          </div>
        </Section>

        <SectionWide id="partenaires" bg="var(--ivory)">
          <SectionHead over={p.partners_overline} title={p.partners_title} />
          <div className="pele-grid-2">
            {(partners || []).map((pt) => (
              <Partner key={pt.id} {...pt} />
            ))}
          </div>
          {p.partners_footer && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)", marginTop: 16 }}>{p.partners_footer}</p>
          )}
        </SectionWide>

        <Section id="eveque">
          <SectionHead over={p.eveque_overline} title={p.eveque_title} />
          <div className="pele-grid-2" style={{ gridTemplateColumns: undefined }}>
            <div style={{ position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-md)", aspectRatio: "3/4" }}>
              {p.eveque_image_url && (
                <Image src={p.eveque_image_url} alt={p.eveque_image_alt || ""} fill sizes="(max-width: 820px) 100vw, 360px" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
              )}
            </div>
            <div>
              <blockquote style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20, lineHeight: 1.6, color: "var(--navy-700)", borderLeft: "3px solid var(--gold-500)", padding: "4px 0 4px 24px", margin: 0 }}>
                {quoteParas.map((para, i) => (
                  <span key={i} style={{ display: "block", marginBottom: i < quoteParas.length - 1 ? 12 : 0 }}>{para}</span>
                ))}
              </blockquote>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: "var(--navy-700)", marginTop: 18 }}>
                {p.eveque_name}
                <span style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 400, fontStyle: "italic", fontSize: 16, color: "var(--ink-soft)", marginTop: 2 }}>{p.eveque_role}</span>
              </div>
            </div>
          </div>
        </Section>

        <SectionWide id="equipe" bg="var(--parchment-2)">
          <SectionHead over={p.equipe_overline} title={p.equipe_title} />
          <div className="pele-grid-2" style={{ alignItems: "center" }}>
            <Prose text={p.equipe_body} />
            <div style={{ position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-md)", aspectRatio: "4/3" }}>
              {p.equipe_image_url && (
                <Image src={p.equipe_image_url} alt={p.equipe_image_alt || ""} fill sizes="(max-width: 820px) 100vw, 360px" style={{ objectFit: "cover" }} />
              )}
            </div>
          </div>
        </SectionWide>

        <Section id="diaporama">
          <SectionHead over={p.diaporama_overline} title={p.diaporama_title} />
          {p.diaporama_desc && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16.5, color: "var(--ink-soft)", margin: "0 0 24px" }}>{p.diaporama_desc}</p>
          )}
          <Gallery items={gallery} />
        </Section>

        <SectionWide id="pour-qui" bg="var(--ivory)">
          <SectionHead over={p.pourqui_overline} title={p.pourqui_title} />
          <div className="pele-grid-2" style={{ alignItems: "center" }}>
            <Prose text={p.pourqui_body} />
            <div style={{ position: "relative", height: 280, borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              {p.pourqui_image_url && (
                <Image src={p.pourqui_image_url} alt={p.pourqui_image_alt || ""} fill sizes="(max-width: 820px) 100vw, 480px" style={{ objectFit: "cover" }} />
              )}
            </div>
          </div>
        </SectionWide>

        <Section id="chapitres">
          <SectionHead over={p.chapitres_overline} title={p.chapitres_title} />
          <Prose text={p.chapitres_body} />
        </Section>

        <SectionWide id="histoire" bg="var(--parchment-2)">
          <SectionHead over={p.histoire_overline} title={p.histoire_title} />
          <Prose text={p.histoire_body} />
        </SectionWide>

        <RelatedLinks current="le-pelerinage" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "Devenir miquelot"} href={p.cta_href || inscriptionUrl || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} nav={nav} />
    </>
  );
}
