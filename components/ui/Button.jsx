"use client";
import { useState } from "react";

/**
 * Bouton — variantes primary / gold / ghost / link.
 * Si `href` est fourni, rend un <a> (pratique pour les CTA d'ancrage).
 */
export default function Button({
  children,
  variant = "primary",
  onClick,
  href,
  onDeep,
  target,
  rel,
  style = {},
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const base = {
    display: "inline-block",
    textDecoration: "none",
    textAlign: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "13px 28px",
    borderRadius: "var(--r-sm)",
    border: "none",
    cursor: "pointer",
    transition: "all .2s cubic-bezier(.22,.61,.36,1)",
    transform: press ? "translateY(1px)" : "none",
  };

  const variants = {
    primary: { background: hover ? "var(--navy-800)" : "var(--navy-700)", color: "var(--gold-200)" },
    gold: { background: hover ? "var(--gold-400)" : "var(--gold-500)", color: "var(--navy-800)" },
    ghost: {
      background: hover ? (onDeep ? "rgba(201,164,94,0.12)" : "rgba(16,58,92,0.06)") : "transparent",
      color: onDeep ? "var(--gold-200)" : "var(--navy-700)",
      border: `1.5px solid ${onDeep ? "var(--gold-500)" : "var(--navy-700)"}`,
      padding: "11.5px 26px",
    },
  };

  if (variant === "link") {
    const linkStyle = {
      display: "inline-block",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "2px 0",
      textDecoration: "none",
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      fontSize: 17,
      color: onDeep ? "var(--gold-200)" : "var(--navy-600)",
      borderBottom: `2px solid ${hover ? "var(--gold-600)" : "var(--gold-500)"}`,
      ...style,
    };
    const handlers = {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    };
    return href ? (
      <a href={href} target={target} rel={rel} style={linkStyle} {...handlers}>
        {children}
      </a>
    ) : (
      <button onClick={onClick} style={linkStyle} {...handlers}>
        {children}
      </button>
    );
  }

  const finalStyle = { ...base, ...variants[variant], ...style };
  const className = variant === "gold" ? "pele-cta-halo" : undefined;
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
  };

  return href ? (
    <a href={href} target={target} rel={rel} className={className} style={finalStyle} {...handlers}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={className} style={finalStyle} {...handlers}>
      {children}
    </button>
  );
}
