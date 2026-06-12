"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Animations du site — portage du moteur du Design System (anims.js),
   adapté à Next.js : défilement du <body>, relance à chaque navigation
   (usePathname), apparition gérée par IntersectionObserver.
   Les keyframes & classes vivent dans globals.css ; ici, le pilotage.

   Modules :
   · Barre de progression de lecture (or)            — active même en reduced-motion
   · Révélation fondu-montée au défilement            (titres, p, listes, images…)
   · Titre cinétique « gravé » (flou → net)           (main h1)
   · Compteurs qui s'égrènent                          (grands chiffres d'affichage)
   · Voile doré qui balaie les images de carte         (main article / .om-card)
   · CTA magnétique                                    (.pele-cta-halo, le halo est en CSS)
   · Cartes à inclinaison 3D douce                     (main article, .om-card)
   · « Ken burns » lent sur bandeaux photo             (images plein cadre)
   · Zoom doux des photos au survol                    (images de carte)
   · Spotlight opt-in                                  ([data-om-spotlight])
   · Entrée du logo dans l'en-tête                     (header médaillon)

   Tout respecte prefers-reduced-motion (seule la barre de progression subsiste). */
export default function Anims() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = !window.matchMedia || window.matchMedia("(hover: hover)").matches;

    /* ====================================================
       Barre de progression de lecture (toujours active)
       ==================================================== */
    let bar = document.getElementById("om-progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "om-progress";
      document.body.appendChild(bar);
    }
    const updProgress = () => {
      const d = document.documentElement;
      const top = d.scrollTop || document.body.scrollTop;
      const max = d.scrollHeight - d.clientHeight;
      bar.style.width = (max > 0 ? Math.max(0, Math.min(1, top / max)) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updProgress, { passive: true });
    window.addEventListener("resize", updProgress);
    updProgress();

    if (reduce) {
      // Mouvement désactivé : on ne garde que la barre de progression.
      return () => {
        window.removeEventListener("scroll", updProgress);
        window.removeEventListener("resize", updProgress);
      };
    }

    /* ====================================================
       Apparition au défilement (déclenche aussi compteurs & titre gravé)
       ==================================================== */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add("om-in");
          io.unobserve(el);
          if (el.hasAttribute("data-om-count")) animateCount(el);
          if (el.hasAttribute("data-om-kinetic")) engrave(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );

    /* ---- Titre « gravé » : one-shot, finit toujours net ---- */
    function engrave(el) {
      if (el.dataset.omEngraved) return;
      el.dataset.omEngraved = "1";
      el.classList.add("om-engrave");
      const settle = () => el.classList.remove("om-engrave");
      el.addEventListener("animationend", function once() {
        settle();
        el.removeEventListener("animationend", once);
      });
      setTimeout(settle, 1200); // repli si l'onglet est en arrière-plan
    }

    /* ---- Compteurs qui s'égrènent ---- */
    // Classe de caractères : chiffres, point, virgule, espace fine insécable ( ),
    // espace insécable ( ) et espace normale — échappements pour rester ASCII-sûr.
    const NUM_RE = /^(\D*?)(\d[\d.,   ]*)(\D*)$/;
    function animateCount(el) {
      if (el.getAttribute("data-om-done") === "1") return;
      el.setAttribute("data-om-done", "1");
      const to = parseInt(el.getAttribute("data-om-to"), 10);
      const pre = el.getAttribute("data-om-pre") || "";
      const suf = el.getAttribute("data-om-suf") || "";
      let t0 = null;
      const dur = 1400;
      function step(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = pre + "0" + suf;
      requestAnimationFrame(step);
    }

    /* ====================================================
       Détection / marquage des éléments à chaque scan
       ==================================================== */
    function setupKinetic(root) {
      root.querySelectorAll("main h1").forEach((h) => {
        if (h.hasAttribute("data-om-kinetic") || h.hasAttribute("data-om-reveal")) return;
        if (h.closest("header") || h.closest("footer")) return;
        h.setAttribute("data-om-kinetic", "");
        io.observe(h);
      });
    }

    function setupCounters(root) {
      root.querySelectorAll("main div, main span, main strong").forEach((el) => {
        if (el.hasAttribute("data-om-count") || el.hasAttribute("data-om-nocount")) return;
        if (el.closest("header") || el.closest("footer") || el.closest("nav")) return;
        if (el.closest("[data-om-nocount]")) return;
        for (let n = el.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 1) return; // feuille uniquement
        }
        const txt = (el.textContent || "").trim();
        if (txt.length > 12) return;
        const m = txt.match(NUM_RE);
        if (!m) return;
        const digits = m[2].replace(/[^\d]/g, "");
        if (!digits.length || digits.length > 6) return;
        const cs = window.getComputedStyle(el);
        const fs = parseFloat(cs.fontSize) || 0;
        const fw = parseInt(cs.fontWeight, 10) || 400;
        if (fs < 32 || fw < 600) return; // uniquement les grands chiffres d'affichage
        el.setAttribute("data-om-count", "");
        el.setAttribute("data-om-pre", m[1]);
        el.setAttribute("data-om-suf", m[3]);
        el.setAttribute("data-om-to", digits);
        io.observe(el);
      });
    }

    function setupBanners(root) {
      // Bandeaux plein cadre (position absolute) -> ken burns
      root.querySelectorAll("main section img").forEach((img) => {
        if (window.getComputedStyle(img).position === "absolute" && !img.classList.contains("om-kb")) {
          if (img.complete) img.classList.add("om-kb");
          else img.addEventListener("load", () => img.classList.add("om-kb"), { once: true });
        }
      });
      // Images de carte -> zoom doux au survol
      root.querySelectorAll("main article, main .om-card").forEach((c) => {
        const img = c.querySelector("img");
        if (img && window.getComputedStyle(img).position !== "absolute") c.classList.add("om-zoom");
      });
    }

    function setupWipe(root) {
      root.querySelectorAll("main article img, main .om-card img, main .om-wipe-target img").forEach((img) => {
        const holder = img.parentElement;
        if (!holder || holder.classList.contains("om-wipe")) return;
        if (window.getComputedStyle(img).position === "absolute") return; // réservé aux bandeaux (ken burns)
        if (holder.closest("header") || holder.closest("footer")) return;
        holder.classList.add("om-wipe");
        if (window.getComputedStyle(holder).position === "static") holder.style.position = "relative";
        const veil = document.createElement("span");
        veil.className = "om-veil";
        holder.appendChild(veil);
        io.observe(holder);
      });
    }

    const SEL = "main h2, main h3, main p, main blockquote, main article, main img, main ul, main ol, main figure";
    function setupReveal(root) {
      root.querySelectorAll(SEL).forEach((el) => {
        if (el.hasAttribute("data-om-reveal") || el.hasAttribute("data-om-kinetic")) return;
        if (el.closest("header") || el.closest("footer")) return;
        if (el.closest(".om-wipe")) return; // image gérée par le voile
        if (el.tagName === "IMG" && window.getComputedStyle(el).position === "absolute") return;
        const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
        const idx = sibs.indexOf(el);
        el.setAttribute("data-om-reveal", "");
        el.style.transitionDelay = Math.min(idx, 6) * 70 + "ms";
        io.observe(el);
      });
    }

    /* ====================================================
       Interactions au survol (souris uniquement)
       ==================================================== */
    function setupMagnetic(root) {
      if (!canHover) return;
      root.querySelectorAll(".pele-cta-halo").forEach((b) => {
        if (b.dataset.omMag) return;
        b.dataset.omMag = "1";
        b.classList.add("om-mag");
        let inner = b.querySelector("span");
        if (!inner && b.childNodes.length) {
          inner = document.createElement("span");
          while (b.firstChild) inner.appendChild(b.firstChild);
          b.appendChild(inner);
        }
        b.addEventListener("mousemove", (e) => {
          const r = b.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          b.style.transform = "translate(" + x * 0.28 + "px," + y * 0.38 + "px)";
          if (inner) inner.style.transform = "translate(" + x * 0.14 + "px," + y * 0.2 + "px)";
        });
        b.addEventListener("mouseleave", () => {
          b.style.transform = "";
          if (inner) inner.style.transform = "";
        });
      });
    }

    function setupTilt(root) {
      if (!canHover) return;
      root.querySelectorAll("main article, main .om-card, main .om-tilt-target").forEach((c) => {
        if (c.dataset.omTilt) return;
        c.dataset.omTilt = "1";
        c.classList.add("om-tilt");
        c.addEventListener("mousemove", (e) => {
          const r = c.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
          c.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
        });
        c.addEventListener("mouseleave", () => {
          c.style.transform = "";
        });
      });
    }

    function setupSpotlight(root) {
      if (!canHover) return;
      root.querySelectorAll("[data-om-spotlight]").forEach((s) => {
        if (s.dataset.omSpot) return;
        s.dataset.omSpot = "1";
        if (window.getComputedStyle(s).position === "static") s.style.position = "relative";
        s.style.overflow = "hidden";
        const glow = document.createElement("div");
        glow.style.cssText =
          "position:absolute;width:300px;height:300px;border-radius:50%;pointer-events:none;" +
          "left:50%;top:50%;transform:translate(-50%,-50%);opacity:0;transition:opacity .3s ease;z-index:1;" +
          "background:radial-gradient(closest-side,rgba(214,183,117,.22),transparent 70%)";
        s.appendChild(glow);
        s.addEventListener("mousemove", (e) => {
          const r = s.getBoundingClientRect();
          glow.style.left = e.clientX - r.left + "px";
          glow.style.top = e.clientY - r.top + "px";
          glow.style.opacity = "1";
        });
        s.addEventListener("mouseleave", () => {
          glow.style.opacity = "0";
        });
      });
    }

    function setupLogo() {
      const img = document.querySelector("header a img");
      if (img && !img.dataset.omLogo) {
        img.dataset.omLogo = "1";
        img.classList.add("om-logoin");
      }
    }

    /* ====================================================
       Orchestration + relance sur contenu monté tardivement
       ==================================================== */
    function tag() {
      const root = document;
      setupKinetic(root);
      setupCounters(root);
      setupBanners(root); // avant le voile : marque .om-zoom / bandeaux
      setupWipe(root);
      setupReveal(root);
      setupMagnetic(root);
      setupTilt(root);
      setupSpotlight(root);
      setupLogo();
    }

    tag();
    const t1 = setTimeout(tag, 250); // re-scan après hydratation/navigation
    const t2 = setTimeout(tag, 900); // re-scan après contenu async (Supabase)

    // Contenu chargé tardivement -> re-scan débouncé.
    let mt;
    const mo = new MutationObserver(() => {
      clearTimeout(mt);
      mt = setTimeout(tag, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(mt);
      mo.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", updProgress);
      window.removeEventListener("resize", updProgress);
    };
  }, [pathname]);

  return null;
}
