"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import useIsMobile from "@/lib/useIsMobile";

export default function Gallery({ items = [] }) {
  const mob = useIsMobile(640);
  const [idx, setIdx] = useState(-1);
  const open = idx >= 0;

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (e.key === "Escape") setIdx(-1);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, items.length]);

  if (!items.length) return null;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 12 }}>
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{ position: "relative", padding: 0, border: "none", cursor: "pointer", borderRadius: "var(--r-md)", overflow: "hidden", aspectRatio: "4/3", background: "var(--navy-800)" }}
            aria-label={it.caption || "Agrandir la photo"}
          >
            <Image src={it.image_url} alt={it.caption || ""} fill sizes="(max-width: 640px) 50vw, 350px" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>

      {open && (
        <div
          onClick={() => setIdx(-1)}
          style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(7,18,28,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <button onClick={() => setIdx(-1)} aria-label="Fermer" style={{ position: "absolute", top: 18, right: 22, background: "none", border: "none", color: "var(--gold-200)", fontSize: 34, cursor: "pointer" }}>
            ×
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + items.length) % items.length); }}
            aria-label="Précédent"
            style={{ position: "absolute", left: 16, background: "none", border: "none", color: "var(--gold-200)", fontSize: 44, cursor: "pointer", padding: 12 }}
          >
            ‹
          </button>
          <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0, maxWidth: "min(1000px, 92vw)", textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[idx].image_url} alt={items[idx].caption || ""} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "var(--r-md)" }} />
            {items[idx].caption && (
              <figcaption style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--gold-100)", marginTop: 14 }}>{items[idx].caption}</figcaption>
            )}
          </figure>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % items.length); }}
            aria-label="Suivant"
            style={{ position: "absolute", right: 16, background: "none", border: "none", color: "var(--gold-200)", fontSize: 44, cursor: "pointer", padding: 12 }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
