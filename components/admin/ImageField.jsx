"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const labelStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.03em",
  color: "var(--navy-700)",
};

/** Compresse/redimensionne une image dans le navigateur avant l'upload.
 *  Max 2000 px sur le plus grand côté, sortie WebP ~82 %. Laisse passer SVG/GIF tels quels. */
async function compressImage(file, maxDim = 2000, quality = 0.82) {
  try {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") return file;
    const dataUrl = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
    const img = await new Promise((res, rej) => {
      const i = document.createElement("img");
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = dataUrl;
    });
    const max = Math.max(img.width, img.height);
    // déjà raisonnable : on ne touche pas
    if (max <= maxDim && file.size < 500 * 1024) return file;
    const scale = Math.min(1, maxDim / max);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/webp", quality));
    if (!blob || blob.size >= file.size) return file; // pas de gain → on garde l'original
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file; // en cas d'échec, on uploade l'original
  }
}

export default function ImageField({ label, value, onChange, folder = "misc", required = false }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const onFile = async (e) => {
    const original = e.target.files && e.target.files[0];
    if (!original) return;
    setUploading(true);
    setErr("");
    try {
      const file = await compressImage(original);
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safe = file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40);
      const path = `${folder}/${Date.now()}-${safe}.${ext}`;
      const { error } = await supabase.storage
        .from("homepage")
        .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
      if (error) {
        setErr(error.message);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from("homepage").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e2) {
      setErr(e2.message);
    }
    setUploading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={labelStyle}>
        {label}
        {required && <span style={{ color: "var(--liturgic-red)" }} title="Champ obligatoire"> *</span>}
      </span>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 120,
            height: 80,
            flex: "none",
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--line)",
            overflow: "hidden",
            background: "var(--navy-800)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "var(--gold-300)", fontSize: 22 }}>✦</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
          <label
            style={{
              display: "inline-block",
              cursor: uploading ? "default" : "pointer",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--navy-700)",
              border: "1.5px solid var(--navy-700)",
              borderRadius: "var(--r-sm)",
              padding: "8px 14px",
              width: "fit-content",
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? "Envoi…" : "Remplacer l'image"}
            <input type="file" accept="image/*" onChange={onFile} disabled={uploading} style={{ display: "none" }} />
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL de l'image"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              padding: "8px 10px",
              background: "var(--ivory)",
              color: "var(--ink-soft)",
              border: "1.5px solid var(--stone-300)",
              borderRadius: "var(--r-sm)",
              outline: "none",
              width: "100%",
            }}
          />
          {err && (
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--liturgic-red)" }}>{err}</span>
          )}
        </div>
      </div>
    </div>
  );
}
