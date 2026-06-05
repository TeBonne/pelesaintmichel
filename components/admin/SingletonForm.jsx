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

export default function SingletonForm({ title, description, fields, initial, action, imageFolder = "misc" }) {
  const [data, setData] = useState(() => {
    const o = {};
    fields.forEach((f) => {
      o[f.key] = initial && initial[f.key] != null ? initial[f.key] : "";
    });
    return o;
  });
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const bar = useSaveBar();
  const id = useId();
  const sectionRef = useRef(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const doSave = useCallback(async () => {
    const d = dataRef.current;
    const missing = fields.filter((f) => f.required && !String(d[f.key] ?? "").trim()).map((f) => f.label);
    if (missing.length) {
      const msg = `« ${title} » : remplissez ${missing.join(", ")}`;
      setStatus("error");
      setErr(`Pour enregistrer, remplissez le(s) champ(s) obligatoire(s) (marqués *) : ${missing.join(", ")}.`);
      return { ok: false, error: msg };
    }
    setStatus("saving");
    setErr("");
    const res = await action(d);
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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fields.map((f) =>
          f.type === "image" ? (
            <ImageField key={f.key} label={f.label} value={data[f.key]} onChange={(v) => set(f.key, v)} folder={imageFolder} required={f.required} />
          ) : (
            <Field key={f.key} label={f.label} type={f.type} placeholder={f.placeholder} hint={f.hint} rows={f.rows} options={f.options} required={f.required} value={data[f.key]} onChange={(v) => set(f.key, v)} />
          )
        )}
      </div>
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
