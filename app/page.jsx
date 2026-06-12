import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Hero from "@/components/site/Hero";
import Chiffres from "@/components/site/Chiffres";
import Programme from "@/components/site/Programme";
import Citation from "@/components/site/Citation";
import Videos from "@/components/site/Videos";
import Faq from "@/components/site/Faq";
import Testimonials from "@/components/site/Testimonials";
import { CtaBand } from "@/components/page/Blocks";
import RelatedLinks from "@/components/page/RelatedLinks";
import { getHomeContent } from "@/lib/queries";

const BASE = "https://www.pelesaintmichel.fr";

// ISR : page mise en cache 1h ; rafraîchie immédiatement après une
// sauvegarde admin via revalidatePath('/').
export const revalidate = 3600;

export default async function HomePage() {
  const { hero, stats, programme, citation, videos, faq, settings, nav, testimonials } = await getHomeContent();

  const channelUrl = settings?.youtube_channel_url;
  const socialLinks = settings || undefined;

  // Avis (Review / AggregateRating) construits depuis les vrais témoignages
  const rated = (testimonials || []).filter((t) => t.rating >= 1 && t.rating <= 5);
  const aggregateRating = rated.length
    ? { "@type": "AggregateRating", ratingValue: (rated.reduce((s, t) => s + t.rating, 0) / rated.length).toFixed(1), reviewCount: rated.length, bestRating: 5, worstRating: 1 }
    : null;
  const reviews = (testimonials || []).map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.author },
    ...(t.rating ? { reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5, worstRating: 1 } } : {}),
    reviewBody: t.quote,
  }));

  // Sous-événements (les 3 jours) depuis le programme
  const dayDates = ["2026-05-08", "2026-05-09", "2026-05-10"];
  const subEvent = (programme || []).slice(0, 3).map((d, i) => ({
    "@type": "Event",
    name: `${d.date_label || dayDates[i]} — ${d.title}`,
    startDate: dayDates[i],
    location: { "@type": "Place", name: "Mont-Saint-Michel, France" },
  }));

  // VideoObject pour les vidéos ayant une date de publication
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

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pèlerinage de Saint Michel",
      url: BASE + "/",
      inLanguage: "fr-FR",
      potentialAction: {
        "@type": "SearchAction",
        target: BASE + "/recherche?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "NGO"],
      name: "Association Pèlerinage de saint Michel",
      url: BASE + "/",
      logo: BASE + "/img/logo-pele-saint-michel.png",
      description: "Association de jeunes laïcs bénévoles organisant le pèlerinage catholique de toute la France au Mont-Saint-Michel.",
      slogan: "Dieu nous aime, et le mal ne l'emportera pas !",
      areaServed: "FR",
      knowsAbout: ["pèlerinage", "saint Michel", "Mont-Saint-Michel", "marche", "prière", "miquelot"],
      ...(settings?.contact_email ? { email: settings.contact_email } : {}),
      address: { "@type": "PostalAddress", addressLocality: "Le Mont-Saint-Michel", addressCountry: "FR" },
      ...(settings?.contact_email
        ? { contactPoint: { "@type": "ContactPoint", contactType: "Inscriptions", email: settings.contact_email, availableLanguage: "French" } }
        : {}),
      sameAs: [settings?.instagram_url, settings?.facebook_url, settings?.youtube_url, settings?.tiktok_url].filter(Boolean),
      ...(reviews.length ? { review: reviews } : {}),
      ...(aggregateRating ? { aggregateRating } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Pèlerinage de Saint Michel 2026",
      startDate: "2026-05-08T08:30:00+02:00",
      endDate: "2026-05-10T15:00:00+02:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      inLanguage: "fr",
      isAccessibleForFree: false,
      image: [BASE + "/opengraph-image"],
      description:
        "Pèlerinage catholique de toute la France au Mont-Saint-Michel : 3 jours de marche et de prière de Saint-Malo au Mont.",
      location: [
        { "@type": "Place", name: "Cathédrale de Saint-Malo", address: "Saint-Malo, France" },
        { "@type": "Place", name: "Mont-Saint-Michel", address: "Le Mont-Saint-Michel, France" },
      ],
      organizer: { "@type": "Organization", name: "Association Pèlerinage de saint Michel", url: BASE + "/" },
      offers: {
        "@type": "Offer",
        name: "Inscription au pèlerinage",
        price: "50",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: settings?.inscription_url || BASE + "/",
        validFrom: "2026-01-01",
      },
      ...(subEvent.length ? { subEvent } : {}),
      url: BASE + "/",
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
    ...videoLd,
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <Testimonials items={testimonials} />
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
      <SiteFooter settings={settings} socialLinks={socialLinks} nav={nav} />
    </>
  );
}
