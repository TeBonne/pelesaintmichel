"use client";
import { useState } from "react";

export const SOCIAL_DEFAULT = {
  instagram_url: "https://www.instagram.com/montsaintmichelpelerinage/",
  facebook_url: "https://www.facebook.com/61573100641502",
  youtube_url: "https://www.youtube.com/@P%C3%A8lerinageFranceSaintMichel",
  tiktok_url: "https://www.tiktok.com/@montstmichelpelerinage",
};

const PATHS = {
  instagram_url: (
    <g>
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <line x1="16.5" y1="7.5" x2="16.51" y2="7.5" />
    </g>
  ),
  facebook_url: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  youtube_url: (
    <g>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </g>
  ),
  tiktok_url: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 9" />,
};

const LABELS = {
  instagram_url: "Instagram",
  facebook_url: "Facebook",
  youtube_url: "YouTube",
  tiktok_url: "TikTok",
};

export default function SocialIcons({ links = SOCIAL_DEFAULT }) {
  const l = { ...SOCIAL_DEFAULT, ...(links || {}) };
  const items = ["instagram_url", "facebook_url", "youtube_url", "tiktok_url"]
    .map((k) => ({ key: k, label: LABELS[k], href: l[k], path: PATHS[k] }))
    .filter((it) => it.href);
  const [hover, setHover] = useState(-1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {items.map((it, i) => (
        <a
          key={it.key}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(-1)}
          style={{
            display: "flex",
            padding: 5,
            borderRadius: "50%",
            color: hover === i ? "var(--gold-400)" : "var(--gold-200)",
            background: hover === i ? "rgba(201,164,94,0.15)" : "transparent",
            transition: "all .15s ease",
          }}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {it.path}
          </svg>
        </a>
      ))}
    </div>
  );
}
