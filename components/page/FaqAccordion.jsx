"use client";
import { useState } from "react";

export default function FaqAccordion({ categories = [] }) {
  const [open, setOpen] = useState("0-0");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      {categories.map((cat, ci) => (
        <div key={cat.id || ci}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(1.5rem,2.4vw,2rem)", color: "var(--navy-700)", margin: "0 0 16px" }}>
            {cat.name}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(cat.items || []).map((it, ii) => {
              const key = `${ci}-${ii}`;
              const isOpen = open === key;
              return (
                <div key={ii} style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                  <button
                    onClick={() => setOpen(isOpen ? "" : key)}
                    aria-expanded={isOpen}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "18px 22px", display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <span style={{ color: "var(--gold-600)", fontSize: 15, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>✦</span>
                    <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 18.5, color: "var(--navy-700)" }}>{it.question}</span>
                  </button>
                  <div style={{ display: isOpen ? "block" : "none", padding: "0 22px 20px 50px" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 16.5, lineHeight: 1.65, color: "var(--ink-soft)", margin: 0 }}>{it.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
