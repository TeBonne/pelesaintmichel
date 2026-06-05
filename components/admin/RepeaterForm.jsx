"use client";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import Field from "./Field";
import ImageField from "./ImageField";
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
const rowStyle = {
  border: "1px solid var(--line)",
  borderRadius: "var(--r-sm)",
  padding: "16px 16px 18px",
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

export default function RepeaterForm({ title, description, fields, initial, action, imageFolder = "misc", emptyItem, addLabel = "Ajouter" }) {
  const [items, setItems] = useState(initial && initial.length ? initial : []);
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  const bar = useSaveBar();
  const id = useId();
  const sectionRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const setField = (i, k, v) => setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const add = () => setItems((arr) => [...arr, { ...emptyItem }]);
  const remove = (i) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const move = (i, dir) =>
    setItems((arr) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const copy = [...arr];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const doSave = useCallback(async () => {
    const list = itemsRef.current;
    for (let i = 0; i < list.length; i++) {
      const miss = fields.filter((f) => f.required && !String(list[i][f.key] ?? "").trim()).map((f) => f.label);
      if (miss.length) {
        const msg = `« ${title} » ligne #${i + 1} : remplissez ${miss.join(", ")}`;
        setStatus("error");
        setErr(`Pour enregistrer, complétez la ligne #${i + 1} — champ(s) obligatoire(s) (marqués *) : ${miss.join(", ")}.`);
        return { ok: false, error: msg };
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
    const detail = (res && res.error) || "échec de l'enregistrement.";
    setStatus("error");
    setErr(detail);
    return { ok: false, error: `« ${title} » : ${detail}` };
  }, [fields, action, title]);

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
        {items.map((item, i) => (
          <div key={i} style={rowStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "var(--gold-700)", letterSpacing: "0.05em" }}>#{i + 1}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" style={miniBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">↑</button>
                <button type="button" style={miniBtn} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Descendre">↓</button>
                <button type="button" style={{ ...miniBtn, color: "var(--liturgic-red)", borderColor: "rgba(123,34,48,0.4)" }} onClick={() => remove(i)}>Supprimer</button>
              </div>
            </div>
            {fields.map((f) =>
              f.type === "image" ? (
                <ImageField key={f.key} label={f.label} value={item[f.key]} onChange={(v) => setField(i, f.key, v)} folder={imageFolder} required={f.required} />
              ) : (
                <Field key={f.key} label={f.label} type={f.type} placeholder={f.placeholder} hint={f.hint} rows={f.rows} options={f.options} required={f.required} value={item[f.key]} onChange={(v) => setField(i, f.key, v)} />
              )
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={add} style={{ ...miniBtn, marginTop: 14, padding: "9px 16px", borderColor: "var(--gold-600)", color: "var(--gold-700)" }}>
        + {addLabel}
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
