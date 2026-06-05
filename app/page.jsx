import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Hero from "@/components/site/Hero";
import Chiffres from "@/components/site/Chiffres";
import Programme from "@/components/site/Programme";
import Citation from "@/components/site/Citation";
import Videos from "@/components/site/Videos";
import Faq from "@/components/site/Faq";
import { CtaBand } from "@/components/page/Blocks";
import RelatedLinks from "@/components/page/RelatedLinks";
import { getHomeContent } from "@/lib/queries";

// ISR : page mise en cache 1h ; rafraîchie immédiatement après une
// sauvegarde admin via revalidatePath('/').
export const revalidate = 3600;

export default async function HomePage() {
  const { hero, stats, programme, citation, videos, faq, settings, nav } = await getHomeContent();

  const channelUrl = settings?.youtube_channel_url;
  const socialLinks = settings || undefined;

  // Données structurées (SEO) générées depuis la base
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pèlerinage de Saint Michel",
      url: "https://www.pelesaintmichel.fr/",
      inLanguage: "fr-FR",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.pelesaintmichel.fr/recherche?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Association Pèlerinage de saint Michel",
      url: "https://www.pelesaintmichel.fr/",
      logo: "https://www.pelesaintmichel.fr/img/logo-pele-saint-michel.png",
      ...(settings?.contact_email ? { email: settings.contact_email } : {}),
      address: { "@type": "PostalAddress", addressLocality: "Le Mont-Saint-Michel", addressCountry: "FR" },
      ...(settings?.contact_email
        ? { contactPoint: { "@type": "ContactPoint", contactType: "Inscriptions", email: settings.contact_email, availableLanguage: "French" } }
        : {}),
      sameAs: [settings?.instagram_url, settings?.facebook_url, settings?.youtube_url, settings?.tiktok_url].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Pèlerinage de Saint Michel 2026",
      startDate: "2026-05-08",
      endDate: "2026-05-10",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      description:
        "Pèlerinage catholique de toute la France au Mont-Saint-Michel : 3 jours de marche et de prière de Saint-Malo au Mont.",
      location: [
        { "@type": "Place", name: "Cathédrale de Saint-Malo", address: "Saint-Malo, France" },
        { "@type": "Place", name: "Mont-Saint-Michel", address: "Le Mont-Saint-Michel, France" },
      ],
      organizer: {
        "@type": "Organization",
        name: "Association Pèlerinage de saint Michel",
        url: "https://www.pelesaintmichel.fr/",
      },
      url: "https://www.pelesaintmichel.fr/",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (faq.length ? faq : []).map((it) => ({
        "@type": "Question",
        name: it.question,
        acceptedAnswer: { "@type": "Answer", text: it.answer },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader socialLinks={socialLinks} nav={nav} inscriptionUrl={settings?.inscription_url} />
      <main id="contenu">
        <Hero data={hero} />
        <Chiffres items={stats} />
        <Programme days={programme} />
        <Citation data={citation} />
        <Videos items={videos} channelUrl={channelUrl} />
        <Faq items={faq} />
        <RelatedLinks current="accueil" title="Explorer le pèlerinage" overline="Le site" />
        <div id="inscription" style={{ scrollMarginTop: 84 }}>
          <CtaBand
            title="Devenir miquelot"
            sub="Rejoignez le pèlerinage du 8 au 10 mai 2026, de Saint-Malo au Mont."
            label="Je m'inscris"
            href={settings?.inscription_url || "#"}
          />
        </div>
      </main>
      <SiteFooter settings={settings} socialLinks={socialLinks} />
    </>
  );
}
