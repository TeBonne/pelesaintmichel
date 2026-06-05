"use client";
import { useState } from "react";
import Overline from "@/components/ui/Overline";
import Button from "@/components/ui/Button";

export const FAQ_DEFAULT = [
  { question: "Qu'est-ce qu'un miquelot ?", answer: "Un miquelot, c'est tout simplement un pèlerin du Mont Saint-Michel, et ce depuis la fin du premier millénaire." },
  { question: "Faut-il marcher seul ou en groupe ?", answer: "Vous pouvez vous inscrire seul, mais nous vous invitons à former un chapitre avec des pèlerins de votre région, si possible avec un prêtre aumônier que vous connaissez." },
  { question: "Combien de kilomètres par jour ?", answer: "Environ 20 à 30 km par jour pour les adultes, sur routes balisées ou de campagne. Des voitures-balais accompagnent les pèlerins fatigués." },
  { question: "Faut-il être baptisé pour participer ?", answer: "Non, le pèlerinage est ouvert à toute personne désireuse d'approfondir sa foi ; il s'agit toutefois d'un pèlerinage catholique." },
];

export default function Faq({ items = FAQ_DEFAULT }) {
  const data = items && items.length ? items : FAQ_DEFAULT;
  const [open, setOpen] = useState(0);
  return (
    <section id="sec-faq" style={{ background: "var(--parchment)", padding: "80px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Overline>Questions fréquentes</Overline>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 600,
              fontSize: 40,
              color: "var(--navy-700)",
              margin: "10px 0 0",
            }}
          >
            Avant de vous mettre en marche
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.map((it, i) => (
            <div
              key={i}
              style={{
                background: "var(--ivory)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    color: "var(--gold-600)",
                    fontSize: 16,
                    transform: open === i ? "rotate(90deg)" : "none",
                    transition: "transform .2s",
                  }}
                >
                  ✦
                </span>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20, color: "var(--navy-700)" }}>
                  {it.question}
                </span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 22px 54px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 16.5, lineHeight: 1.65, color: "var(--ink-soft)", margin: 0 }}>
                    {it.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Button variant="ghost" href="/faq">Voir toutes les questions</Button>
        </div>
      </div>
    </section>
  );
}
