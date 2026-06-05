"use client";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import SaveButton from "./SaveButton";
import { useSaveBar } from "./SaveBarContext";

const cardStyle = {
  background: "var(--ivory)",
  border: "1px solid var(--line)",
  borderTop: "3px solid var(--gold-500)",
  borderRadius: "var(--r-md)",
  boxShadow: "var(--shadow-sm)",
  padding: "24px 26px 26px",
};
const topRow = {
  border: "1px solid var(--line)",
  borderRadius: "var(--r-sm)",
  padding: "16px",
  background: "var(--parchment)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
const miniBtn = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid var(--stone-300)",
  background: "var(--ivory)",
  color: "var(--navy-700)",
  borderRadius: "var(--r-sm)",
  padding: "5px 10px",
  cursor: "pointer",
};
const inputStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  padding: "9px 11px",
  background: "var(--ivory)",
  color: "var(--ink)",
  border: "1.5px solid var(--stone-300)",
  borderRadius: "var(--r-sm)",
  outline: "none",
  width: "100%",
};
const labelStyle = { fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "var(--navy-700)" };

function LabelHref({ item, onChange, labelPlaceholder, hrefPlaceholder }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={labelStyle}>Texte affiché</span>
        <input style={inputStyle} value={item.label || ""} placeholder={labelPlaceholder} onChange={(e) => onChange({ ...item, label: e.target.value })} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={labelStyle}>Lien (URL ou ancre)</span>
        <input style={inputStyle} value={item.href || ""} placeholder={hrefPlaceholder} onChange={(e) => onChange({ ...item, href: e.target.value })} />
      </label>
    </div>
  );
}

export default function NavEditor({ title, description, initial, action }) {
  const [items, setItems] = useState(
    (initial || []).map((t) => ({ label: t.label, href: t.href, children: (t.children || []).map((c) => ({ label: c.label, href: c.href })) }))
  );
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  const bar = useSaveBar();
  const id = useId();
  const sectionRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const setTop = (i, val) => setItems((arr) => arr.map((it, idx) => (idx === i ? val : it)));
  const addTop = () => setItems((arr) => [...arr, { label: "", href: "", children: [] }]);
  const removeTop = (i) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const moveTop = (i, dir) =>
    setItems((arr) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const c = [...arr];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  const setChild = (ti, ci, val) =>
    setItems((arr) => arr.map((t, idx) => (idx === ti ? { ...t, children: t.children.map((c, k) => (k === ci ? val : c)) } : t)));
  const addChild = (ti) =>
    setItems((arr) => arr.map((t, idx) => (idx === ti ? { ...t, children: [...t.children, { label: "", href: "" }] } : t)));
  const removeChild = (ti, ci) =>
    setItems((arr) => arr.map((t, idx) => (idx === ti ? { ...t, children: t.children.filter((_, k) => k !== ci) } : t)));
  const moveChild = (ti, ci, dir) =>
    setItems((arr) =>
      arr.map((t, idx) => {
        if (idx !== ti) return t;
        const j = ci + dir;
        if (j < 0 || j >= t.children.length) return t;
        const c = [...t.children];
        [c[ci], c[j]] = [c[j], c[ci]];
        return { ...t, children: c };
      })
    );

  const doSave = useCallback(async () => {
    const list = itemsRef.current;
    for (let i = 0; i < list.length; i++) {
      const t = list[i];
      if (!String(t.label ?? "").trim() || !String(t.href ?? "").trim()) {
        const msg = `« ${title} » entrée #${i + 1} : libellé et lien obligatoires`;
        setStatus("error");
        setErr(`Entrée #${i + 1} : le libellé et le lien sont obligatoires.`);
        return { ok: false, error: msg };
      }
      for (let j = 0; j < (t.children || []).length; j++) {
        const c = t.children[j];
        if (!String(c.label ?? "").trim() || !String(c.href ?? "").trim()) {
          const msg = `« ${title} » entrée #${i + 1}, sous-entrée #${j + 1} : libellé et lien obligatoires`;
          setStatus("error");
          setErr(`Entrée #${i + 1}, sous-entrée #${j + 1} : libellé et lien obligatoires.`);
          return { ok: false, error: msg };
        }
      }
    }
    setStatus("saving");
    setErr("");
    const res = await action(list);
    if (res && res.ok) {
      setStatus("ok");
      setTimeout(() => setStatus((s) => (s === "ok" ? null : s)), 2500);
      return { ok: true };
    }
    const detail = (res && res.error) || "L'enregistrement a échoué. Vérifiez que chaque entrée a un libellé et un lien.";
    setStatus("error");
    setErr(detail);
    return { ok: false, error: `« ${title} » : ${detail}` };
  }, [action, title]);

  useEffect(() => {
    if (!bar) return;
    return bar.register(id, {
      save: doSave,
      focus: () => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
    });
  }, [bar, id, doSave]);

  return (
    <section ref={sectionRef} style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 24, color: "var(--navy-700)", margin: "0 0 4px" }}>{title}</h2>
      {description && <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)", margin: "0 0 18px" }}>{description}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((top, ti) => (
          <div key={ti} style={topRow}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "var(--gold-700)", letterSpacing: "0.05em" }}>
                Entrée #{ti + 1}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" style={miniBtn} onClick={() => moveTop(ti, -1)} disabled={ti === 0}>↑</button>
                <button type="button" style={miniBtn} onClick={() => moveTop(ti, 1)} disabled={ti === items.length - 1}>↓</button>
                <button type="button" style={{ ...miniBtn, color: "var(--liturgic-red)", borderColor: "rgba(123,34,48,0.4)" }} onClick={() => removeTop(ti)}>Supprimer</button>
              </div>
            </div>

            <LabelHref item={top} onChange={(v) => setTop(ti, { ...v, children: top.children })} labelPlaceholder="Programme" hrefPlaceholder="/programme ou #sec-prog" />

            {/* Sous-entrées */}
            <div style={{ borderLeft: "2px solid var(--gold-300)", paddingLeft: 14, marginLeft: 2, display: "flex", flexDirection: "column", gap: 10 }}>
              {top.children.length > 0 && (
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Sous-menu
                </span>
              )}
              {top.children.map((child, ci) => (
                <div key={ci} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <LabelHref item={child} onChange={(v) => setChild(ti, ci, v)} labelPlaceholder="Présentation" hrefPlaceholder="/le-pelerinage" />
                  </div>
                  <div style={{ display: "flex", gap: 4, paddingBottom: 1 }}>
                    <button type="button" style={miniBtn} onClick={() => moveChild(ti, ci, -1)} disabled={ci === 0}>↑</button>
                    <button type="button" style={miniBtn} onClick={() => moveChild(ti, ci, 1)} disabled={ci === top.children.length - 1}>↓</button>
                    <button type="button" style={{ ...miniBtn, color: "var(--liturgic-red)", borderColor: "rgba(123,34,48,0.4)" }} onClick={() => removeChild(ti, ci)}>✕</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addChild(ti)} style={{ ...miniBtn, width: "fit-content", borderColor: "var(--gold-600)", color: "var(--gold-700)" }}>
                + Ajouter une sous-entrée
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addTop} style={{ ...miniBtn, marginTop: 14, padding: "9px 16px", borderColor: "var(--gold-600)", color: "var(--gold-700)" }}>
        + Ajouter une entrée
      </button>

      {bar ? (
        status === "error" && err ? (
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--liturgic-red)", lineHeight: 1.4 }}>{err}</div>
        ) : status === "ok" ? (
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#2f7d3a" }}>Enregistré ✓</div>
        ) : null
      ) : (
        <SaveButton status={status} error={err} onClick={doSave} />
      )}
    </section>
  );
}
