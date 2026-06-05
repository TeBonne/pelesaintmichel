"use client";
import { createContext, useContext, useRef, useState, useCallback } from "react";

const Ctx = createContext(null);
export function useSaveBar() {
  return useContext(Ctx);
}

/** Fournit une barre d'enregistrement unique : chaque section s'y enregistre,
 *  et le bouton « Enregistrer » sauvegarde toutes les sections en une fois. */
export function SaveBarProvider({ children }) {
  const registry = useRef(new Map()); // id -> { save: async () => {ok, error} }
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(null); // 'saving' | 'ok' | 'error'
  const [errors, setErrors] = useState([]);

  const register = useCallback((id, entry) => {
    registry.current.set(id, entry);
    setCount(registry.current.size);
    return () => {
      registry.current.delete(id);
      setCount(registry.current.size);
    };
  }, []);

  const saveAll = useCallback(async () => {
    setStatus("saving");
    setErrors([]);
    const errs = [];
    let firstFailed = null;
    for (const [, entry] of registry.current) {
      try {
        const res = await entry.save();
        if (!res || !res.ok) {
          errs.push(res?.error || "Une section n'a pas pu être enregistrée.");
          if (!firstFailed) firstFailed = entry;
        }
      } catch (e) {
        errs.push(e?.message || "Erreur inattendue lors de l'enregistrement.");
        if (!firstFailed) firstFailed = entry;
      }
    }
    if (errs.length) {
      setStatus("error");
      setErrors(errs);
      if (firstFailed && typeof firstFailed.focus === "function") {
        setTimeout(() => firstFailed.focus(), 50);
      }
    } else {
      setStatus("ok");
      setTimeout(() => setStatus(null), 3500);
    }
  }, []);

  return <Ctx.Provider value={{ register, saveAll, status, errors, count }}>{children}</Ctx.Provider>;
}

export function StickySaveBar() {
  const bar = useSaveBar();
  if (!bar || bar.count === 0) return null;
  const { status, errors, saveAll } = bar;

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, maxWidth: "min(460px, calc(100vw - 48px))" }}>
      {status === "error" && errors.length > 0 && (
        <div style={{ background: "var(--ivory)", border: "1px solid var(--liturgic-red)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-lg)", padding: "12px 16px", maxHeight: 240, overflowY: "auto" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13, color: "var(--liturgic-red)", marginBottom: 6 }}>
            Enregistrement incomplet — à corriger :
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink)", lineHeight: 1.5 }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--navy-900)", borderRadius: "var(--r-pill)", padding: "8px 8px 8px 18px", boxShadow: "var(--shadow-lg)" }}>
        {status === "ok" && <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--gold-200)" }}>✓ Modifications enregistrées</span>}
        {status === "saving" && <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-200)" }}>Enregistrement…</span>}
        {status === "error" && <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-300)" }}>Corrigez les champs signalés ↑</span>}
        <button
          onClick={saveAll}
          disabled={status === "saving"}
          className="pele-cta-halo"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--navy-800)", background: "var(--gold-500)", border: "none", borderRadius: "var(--r-pill)", padding: "12px 28px", cursor: status === "saving" ? "default" : "pointer", opacity: status === "saving" ? 0.7 : 1 }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
