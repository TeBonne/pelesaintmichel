"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Animations du site (portage de anims.js) :
   - apparition fondu-montée au défilement (IntersectionObserver)
   - léger « ken burns » sur les bandeaux photo plein cadre
   - zoom doux des photos de contenu au survol
   Respecte prefers-reduced-motion. Se relance à chaque changement de page. */
export default function Anims() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const SEL = "main h1, main h2, main h3, main p, main blockquote, main article, main img, main ul, main ol";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("om-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );

    function tag() {
      document.querySelectorAll(SEL).forEach((el) => {
        if (el.hasAttribute("data-om-reveal")) return;
        if (el.closest("header") || el.closest("footer")) return;
        // Les images plein cadre (absolute) reçoivent le ken burns, pas la révélation.
        if (el.tagName === "IMG" && getComputedStyle(el).position === "absolute") return;
        const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
        const idx = sibs.indexOf(el);
        el.setAttribute("data-om-reveal", "");
        el.style.transitionDelay = Math.min(idx, 6) * 70 + "ms";
        io.observe(el);
      });

      // Ken burns sur les images plein cadre
      document.querySelectorAll("main section img").forEach((img) => {
        if (getComputedStyle(img).position === "absolute" && !img.classList.contains("om-kb")) {
          if (img.complete) img.classList.add("om-kb");
          else img.addEventListener("load", () => img.classList.add("om-kb"), { once: true });
        }
      });

      // Zoom au survol sur les images de cartes/articles
      document.querySelectorAll("main article").forEach((c) => {
        const img = c.querySelector("img");
        if (img && getComputedStyle(img).position !== "absolute") c.classList.add("om-zoom");
      });
    }

    tag();
    const t = setTimeout(tag, 250); // re-scan après hydratation/navigation
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
