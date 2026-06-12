import Image from "next/image";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, SectionWide, CtaBand } from "@/components/page/Blocks";
import { getBoutiqueContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getBoutiqueContent();
  return pageMeta({
    title: page?.meta_title || "Boutique — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/boutique",
    image: page?.hero_image_url,
  });
}

function ProductCard({ name, price, description, image_url }) {
  return (
    <div style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", background: "#fff", aspectRatio: "1/1", borderBottom: "1px solid var(--line)" }}>
        {image_url && <Image src={image_url} alt={name} fill sizes="(max-width: 820px) 100vw, 360px" style={{ objectFit: "contain", padding: 18 }} />}
      </div>
      <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)", margin: 0 }}>{name}</h3>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--gold-700)", whiteSpace: "nowrap" }}>{price}</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ink-soft)", margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

export default async function BoutiquePage() {
  const { page, products, nav, settings } = await getBoutiqueContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;

  const abs = (u) => (!u ? undefined : u.startsWith("http") ? u : "https://www.pelesaintmichel.fr" + u);
  const productsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (products || []).map((pr, i) => {
      const price = String(pr.price || "").replace(/[^0-9,.]/g, "").replace(",", ".");
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: pr.name,
          image: abs(pr.image_url),
          description: pr.description || undefined,
          ...(price
            ? { offers: { "@type": "Offer", priceCurrency: "EUR", price, availability: "https://schema.org/PreOrder", url: "https://www.pelesaintmichel.fr/boutique" } }
            : {}),
        },
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsLd) }} />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="Boutique" />
      <main id="contenu">
        <Breadcrumb current="Boutique" path="/boutique" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />

        {(p.precommande_title || p.precommande_body) && (
          <section style={{ background: "var(--navy-800)", padding: "32px 32px" }}>
            <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
              {p.precommande_title && <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, color: "var(--gold-300)", marginBottom: 8 }}>{p.precommande_title}</div>}
              {p.precommande_body && <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6, color: "var(--gold-100)", margin: 0 }}>{p.precommande_body}</p>}
            </div>
          </section>
        )}

        <SectionWide bg="var(--parchment)">
          <div className="pele-grid-3">
            {(products || []).map((pr) => (
              <ProductCard key={pr.id} {...pr} />
            ))}
          </div>
          {p.disclaimer && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--stone-500)", textAlign: "center", marginTop: 24 }}>{p.disclaimer}</p>
          )}
        </SectionWide>

        <RelatedLinks current="boutique" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "S'inscrire"} href={p.cta_href || inscriptionUrl || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} nav={nav} />
    </>
  );
}
