import Image from "next/image";
import Overline from "@/components/ui/Overline";
import Button from "@/components/ui/Button";

export const HERO_DEFAULT = {
  overline: "Du 8 au 10 mai 2026 · Saint-Malo → le Mont",
  title: "Le pèlerinage de toute la France au Mont Saint-Michel",
  subtitle:
    "Trois jours et trois nuits de marche et de prière pour nous tourner vers le Christ, sous la bannière de saint Michel et des anges.",
  primary_label: "Devenir miquelot",
  primary_href: "#inscription",
  ghost_label: "Découvrir le programme",
  ghost_href: "#sec-prog",
  bg_image_url: "/img/illustration-edition.png",
  bg_image_alt: "Saint Michel archange désignant le Mont-Saint-Michel",
  youtube_id: "qulE58yUOsI",
};

export default function Hero({ data = HERO_DEFAULT }) {
  const d = { ...HERO_DEFAULT, ...(data || {}) };
  return (
    <section
      style={{
        position: "relative",
        minHeight: 660,
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        background: "var(--navy-900)",
      }}
    >
      {d.bg_image_url && (
        <Image
          src={d.bg_image_url}
          alt={d.bg_image_alt || ""}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center center" }}
        />
      )}
      {d.youtube_id && (
        <div
          style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${d.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${d.youtube_id}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&vq=hd1080&hd=1`}
            title="Pèlerinage de Saint Michel — vidéo d'ambiance"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "56.25vw",
              minWidth: 1174,
              minHeight: 660,
              border: 0,
              pointerEvents: "none",
            }}
          />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(7,34,58,0.30) 0%, rgba(7,34,58,0.10) 32%, rgba(7,34,58,0.55) 64%, rgba(7,34,58,0.94) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 32px 64px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <Overline onDeep>{d.overline}</Overline>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.6rem,5vw,4rem)",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              color: "var(--gold-100)",
              margin: "18px 0 0",
              textWrap: "balance",
              textShadow: "0 2px 30px rgba(7,34,58,0.5)",
            }}
          >
            {d.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 500,
              fontSize: 22,
              lineHeight: 1.5,
              color: "var(--gold-100)",
              margin: "20px 0 0",
              maxWidth: 540,
              textShadow: "0 1px 16px rgba(7,34,58,0.6)",
            }}
          >
            {d.subtitle}
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <Button variant="gold" href={d.primary_href} style={{ fontWeight: 800 }}>
              {d.primary_label}
            </Button>
            <Button variant="ghost" onDeep href={d.ghost_href}>
              {d.ghost_label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
