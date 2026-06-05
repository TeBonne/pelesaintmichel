"use client";
import { useState, useEffect } from "react";

/** Renvoie vrai si la fenêtre est plus étroite que `bp` (px). */
export default function useIsMobile(bp = 820) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < bp);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return m;
}
