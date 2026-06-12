import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, SubNav, Section, SectionWide, SectionHead, CtaBand } from "@/components/page/Blocks";
import Gallery from "@/components/page/Gallery";
import { getRessourcesContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getRessourcesContent();
  return pageMeta({
    title: page?.meta_title || "Ressources — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/ressources",
    image: page?.hero_image_url,
  });
}

const SUB = [
  ["Vidéos", "#videos"],
  ["Photos", "#photos"],
  ["Documents PDF", "#documents"],
  ["Newsletters", "#newsletters"],
];

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export default async function RessourcesPage() {
  const { page, videos, photos, documents, newsletters, nav, settings } = await getRessourcesContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;

  const videoLd = (videos || [])
    .filter((v) => v.published_at && v.youtube_id)
    .map((v) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: v.title,
      description: v.subtitle || v.title,
      thumbnailUrl: [`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`],
      uploadDate: v.published_at,
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtube_id}`,
      contentUrl: `https://www.youtube.com/watch?v=${v.youtube_id}`,
    }));

  return (
    <>
      {videoLd.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="Ressources" />
      <main id="contenu">
        <Breadcrumb current="Ressources" path="/ressources" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />
        <SubNav items={SUB} active="Vidéos" />

        <SectionWide id="videos" bg="var(--ivory)">
          <SectionHead over={p.videos_overline} title={p.videos_title} />
          <div className="pele-grid-videos">
            {(videos || []).map((v) => (
              <div key={v.id} style={{ background: "var(--parchment)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "var(--navy-800)" }}>
                  <iframe src={"https://www.youtube-nocookie.com/embed/" + v.youtube_id} title={v.title} loading="lazy" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
                </div>
                <div style={{ padding: "16px 18px 18px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, lineHeight: 1.25, color: "var(--navy-700)" }}>{v.title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--ink-soft)", marginTop: 5 }}>{v.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          {p.channel_url && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <a href={p.channel_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 16, color: "var(--navy-600)", textDecoration: "none", borderBottom: "2px solid var(--gold-500)", paddingBottom: 2 }}>Voir la chaîne YouTube →</a>
            </div>
          )}
        </SectionWide>

        <Section id="photos" bg="var(--parchment)">
          <SectionHead over={p.photos_overline} title={p.photos_title} />
          {p.photos_desc && <p style={{ fontFamily: "var(--font-body)", fontSize: 16.5, color: "var(--ink-soft)", margin: "0 0 24px" }}>{p.photos_desc}</p>}
          <Gallery items={photos} />
        </Section>

        <SectionWide id="documents" bg="var(--ivory)">
          <SectionHead over={p.documents_overline} title={p.documents_title} />
          <div className="pele-grid-2">
            {(documents || []).map((d) => (
              <a key={d.id} href={d.url || "#"} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--parchment)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "20px 22px", textDecoration: "none", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ flex: "none", width: 46, height: 46, borderRadius: "var(--r-sm)", background: "var(--navy-700)", color: "var(--gold-300)", display: "flex", alignItems: "center", justifyContent: "center" }}><DownloadIcon /></span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)" }}>{d.title}</span>
                  <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-soft)", margin: "4px 0 8px" }}>{d.description}</span>
                  {d.tag && <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)", background: "var(--gold-100)", border: "1px solid var(--gold-300)", padding: "3px 9px", borderRadius: "var(--r-pill)" }}>{d.tag}</span>}
                </span>
              </a>
            ))}
          </div>
        </SectionWide>

        <Section id="newsletters" bg="var(--parchment)">
          <SectionHead over={p.newsletters_overline} title={p.newsletters_title} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(newsletters || []).map((n) => (
              <a key={n.id} href={n.url || "#"} style={{ display: "flex", gap: 18, alignItems: "center", justifyContent: "space-between", background: "var(--ivory)", border: "1px solid var(--line)", borderLeft: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", padding: "18px 22px", textDecoration: "none", boxShadow: "var(--shadow-sm)" }}>
                <span>
                  <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)" }}>{n.title}</span>
                  <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-soft)", marginTop: 3 }}>{n.description}</span>
                </span>
                <span style={{ flex: "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gold-700)" }}>{n.date_label}</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--navy-600)" }}>→</span>
                </span>
              </a>
            ))}
          </div>
          {p.newsletters_footer && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-soft)", textAlign: "center", marginTop: 22 }}>{p.newsletters_footer}</p>
          )}
        </Section>

        <RelatedLinks current="ressources" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "S'inscrire"} href={p.cta_href || inscriptionUrl || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} />
    </>
  );
}
