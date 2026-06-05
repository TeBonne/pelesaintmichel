import Overline from "@/components/ui/Overline";
import GoldRule from "@/components/ui/GoldRule";

export const VIDEOS_DEFAULT = [
  { youtube_id: "qulE58yUOsI", title: "Pèlerinage de Saint Michel", subtitle: "De Saint-Malo au Mont" },
  { youtube_id: "22iyBAJUZz4", title: "Dans les pas de saint Michel", subtitle: "Les miquelots en marche" },
  { youtube_id: "xJXTC6mvxSE", title: "Le pèlerinage en images", subtitle: "Trois jours de marche et de prière" },
];

const CHANNEL_DEFAULT = "https://www.youtube.com/@pelerinagedesaintmichel";

export default function Videos({ items = VIDEOS_DEFAULT, channelUrl = CHANNEL_DEFAULT }) {
  const list = items && items.length ? items : VIDEOS_DEFAULT;
  return (
    <section id="sec-videos" style={{ background: "var(--ivory)", padding: "72px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Overline>En images</Overline>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 600,
              fontSize: "clamp(1.8rem,3vw,2.4rem)",
              color: "var(--navy-700)",
              margin: "8px 0 0",
            }}
          >
            Le pèlerinage en vidéo
          </h2>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <GoldRule />
          </div>
        </div>
        <div className="pele-grid-videos">
          {list.map((v, i) => (
            <div
              key={v.youtube_id || i}
              style={{
                background: "var(--parchment)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "var(--navy-800)" }}>
                <iframe
                  src={"https://www.youtube-nocookie.com/embed/" + v.youtube_id}
                  title={v.title}
                  loading="lazy"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 17,
                    lineHeight: 1.25,
                    color: "var(--navy-700)",
                  }}
                >
                  {v.title}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--ink-soft)", marginTop: 5 }}>
                  {v.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
        {channelUrl && (
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--navy-600)",
                textDecoration: "none",
                borderBottom: "2px solid var(--gold-500)",
                paddingBottom: 2,
              }}
            >
              Voir la chaîne YouTube →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
