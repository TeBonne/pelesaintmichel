import Overline from "@/components/ui/Overline";
import GoldRule from "@/components/ui/GoldRule";
import PhotoSlot from "@/components/ui/PhotoSlot";

export const PROGRAMME_DEFAULT = [
  {
    date_label: "Vendredi 8 mai",
    title: "Le départ",
    body: "Messe à la cathédrale de Saint-Malo et procession dans les rues de la vieille ville, puis première marche vers le bivouac.",
    photo_caption: "Cathédrale de Saint-Malo",
    image_url: "/img/depart-saintmalo.jpg",
    image_pos: "center 40%",
  },
  {
    date_label: "Samedi 9 mai",
    title: "Le chemin",
    body: "Marche en chapitre, topos et témoignages sur le combat spirituel. Le soir, grande montée aux flambeaux jusqu'au Mont et veillée à l'abbatiale.",
    photo_caption: "Montée aux flambeaux",
    image_url: "/img/montee-flambeaux.jpg",
    image_pos: "center 35%",
  },
  {
    date_label: "Dimanche 10 mai",
    title: "L'arrivée",
    body: "Remise du plomb de Saint-Michel, insigne du pèlerin refondu pour l'occasion, et messe de clôture au pied du Mont.",
    photo_caption: "Le Mont en majesté",
    image_url: "/img/mont-procession.jpg",
    image_pos: "center 30%",
  },
];

export default function Programme({ days = PROGRAMME_DEFAULT }) {
  const list = days && days.length ? days : PROGRAMME_DEFAULT;
  return (
    <section id="sec-prog" style={{ background: "var(--ivory)", padding: "80px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Overline>Le déroulé</Overline>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 600,
              fontSize: 40,
              color: "var(--navy-700)",
              margin: "10px 0 16px",
            }}
          >
            Trois jours en marche
          </h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoldRule />
          </div>
        </div>
        <div className="pele-grid-3">
          {list.map((day, i) => (
            <article
              key={i}
              style={{
                background: "var(--ivory)",
                border: "1px solid var(--line)",
                borderTop: "3px solid var(--gold-500)",
                borderRadius: "var(--r-md)",
                boxShadow: "var(--shadow-md)",
                overflow: "hidden",
              }}
            >
              <PhotoSlot label={day.photo_caption} src={day.image_url} pos={day.image_pos} ratio="4/3" radius="0" />
              <div style={{ padding: "22px 24px 26px" }}>
                <Overline>{day.date_label}</Overline>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: "0.03em",
                    color: "var(--navy-700)",
                    margin: "8px 0 10px",
                  }}
                >
                  {day.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  {day.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
