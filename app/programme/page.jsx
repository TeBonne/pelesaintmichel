import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, Section, SectionWide, SectionHead, Prose, CtaBand, InfoCard } from "@/components/page/Blocks";
import { getProgrammeContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getProgrammeContent();
  return pageMeta({
    title: page?.meta_title || "Programme — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/programme",
    image: page?.hero_image_url,
  });
}

function DayCard({ number, date_label, title, body, image_url, image_alt }) {
  return (
    <article style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
      {image_url && (
        <div style={{ position: "relative", width: "100%", height: 190 }}>
          <Image src={image_url} alt={image_alt || title || ""} fill sizes="(max-width: 820px) 100vw, 360px" style={{ objectFit: "cover" }} />
        </div>
      )}
      <div style={{ padding: "22px 24px 26px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--gold-700)" }}>{number}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--gold-700)" }}>{date_label}</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, letterSpacing: "0.03em", color: "var(--navy-700)", margin: "6px 0 10px" }}>{title}</h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6, color: "var(--ink-soft)", margin: 0 }}>{body}</p>
      </div>
    </article>
  );
}

export default async function ProgrammePage() {
  const { page, days, daily, facts, nav, settings } = await getProgrammeContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="Programme" />
      <main id="contenu">
        <Breadcrumb current="Programme" path="/programme" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />

        <Section>
          <SectionHead over={p.intro_overline} title={p.intro_title} />
          <Prose text={p.intro_body} />
        </Section>

        <SectionWide bg="var(--ivory)">
          <SectionHead over={p.days_overline} title={p.days_title} center />
          <div className="pele-grid-3" style={{ marginTop: 8 }}>
            {(days || []).map((d) => (
              <DayCard key={d.id} {...d} />
            ))}
          </div>
        </SectionWide>

        <Section>
          <SectionHead over={p.daily_overline} title={p.daily_title} />
          <div className="pele-grid-2">
            {(daily || []).map((c) => (
              <InfoCard key={c.id} icon={null} title={c.title} text={c.text} />
            ))}
          </div>
        </Section>

        <SectionWide bg="var(--parchment-2)">
          <SectionHead over={p.facts_overline} title={p.facts_title} />
          <div className="pele-grid-4">
            {(facts || []).map((f) => (
              <div key={f.id} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 44, color: "var(--navy-700)", lineHeight: 1 }}>{f.key_text}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--ink-soft)", marginTop: 6 }}>{f.value_text}</div>
              </div>
            ))}
          </div>
        </SectionWide>

        <RelatedLinks current="programme" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "S'inscrire"} href={p.cta_href || inscriptionUrl || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} />
    </>
  );
}
