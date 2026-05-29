/* ============================================================
   Animations du site — sobres & recueillies (charte Pèlerinage)
   · Apparition fondu-montée au défilement (IntersectionObserver)
   · Léger « ken burns » sur les bandeaux photo
   · Zoom doux des photos au survol
   Vanilla JS — chargé après l'app React, se relance via MutationObserver.
   Respecte prefers-reduced-motion.
   ============================================================ */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Styles injectés
  var css = document.createElement("style");
  css.textContent = [
    "[data-om-reveal]{opacity:0;transform:translateY(20px);" +
      "transition:opacity .7s cubic-bezier(.22,.61,.36,1),transform .7s cubic-bezier(.22,.61,.36,1);will-change:opacity,transform}",
    "[data-om-reveal].om-in{opacity:1;transform:none}",
    // bandeaux : léger zoom lent (ken burns)
    "section img.om-kb{animation:omKenBurns 18s ease-out forwards}",
    "@keyframes omKenBurns{from{transform:scale(1.08)}to{transform:scale(1)}}",
    // photos de contenu : zoom doux au survol (sur le conteneur qui a overflow:hidden)
    ".om-zoom{overflow:hidden}",
    ".om-zoom img{transition:transform .9s cubic-bezier(.22,.61,.36,1)}",
    ".om-zoom:hover img{transform:scale(1.05)}",
    "@media (prefers-reduced-motion: reduce){[data-om-reveal]{opacity:1!important;transform:none!important}" +
      "section img.om-kb{animation:none!important}}"
  ].join("");
  document.head.appendChild(css);

  if (reduce) return;

  var watched = [];           // éléments en attente de révélation
  var lastRun = 0, pending = false;

  function revealCheck() {
    lastRun = Date.now(); pending = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var trigger = vh * 0.92;  // révèle quand le haut de l'élément passe ce seuil
    for (var i = watched.length - 1; i >= 0; i--) {
      var el = watched[i];
      var r = el.getBoundingClientRect();
      if (r.top < trigger) {   // une fois le seuil franchi, on révèle (et on garde révélé)
        el.classList.add("om-in");
        watched.splice(i, 1);
      }
    }
  }
  function onScroll() {
    var now = Date.now();
    if (now - lastRun > 80) { revealCheck(); }
    else if (!pending) { pending = true; setTimeout(revealCheck, 90); }
  }

  // Sélecteurs de contenu à révéler (éléments de bloc, pas la nav ni le footer chrome)
  var SEL = "main h1, main h2, main h3, main p, main blockquote, main article, main img, main ul, main ol";

  function tag(root) {
    // 1) révélations
    var nodes = (root || document).querySelectorAll(SEL);
    nodes.forEach(function (el) {
      if (el.hasAttribute("data-om-reveal")) return;
      if (el.closest("header") || el.closest("footer")) return;
      // stagger : selon la position parmi les frères de même type
      var sibs = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
      var idx = sibs.indexOf(el);
      var delay = Math.min(idx, 6) * 70;
      el.setAttribute("data-om-reveal", "");
      el.style.transitionDelay = delay + "ms";
      watched.push(el);
    });
    revealCheck();
    // 2) ken burns sur les images de bandeau (1ʳᵉ image d'une section "hero")
    document.querySelectorAll("main > section:first-of-type img, main section img").forEach(function (img) {
      // seulement les images plein cadre (position absolute, couvrant)
      var cs = window.getComputedStyle(img);
      if (cs.position === "absolute" && !img.classList.contains("om-kb")) {
        if (img.complete) img.classList.add("om-kb");
        else img.addEventListener("load", function () { img.classList.add("om-kb"); });
      }
    });
    // 3) zoom au survol : conteneurs d'images de contenu (img non absolute dans une carte/article)
    document.querySelectorAll("main article, main .om-card").forEach(function (c) {
      var img = c.querySelector("img");
      if (img && window.getComputedStyle(img).position !== "absolute") c.classList.add("om-zoom");
    });
  }

  var t;
  function scheduleScan() { clearTimeout(t); t = setTimeout(function () { tag(document); }, 60); }

  // Attache les écouteurs de défilement (le conteneur #site-scroll est créé par React)
  var bound = false;
  function bindScroll() {
    var sc = document.getElementById("site-scroll");
    if (sc && !bound) { bound = true; sc.addEventListener("scroll", onScroll, { passive: true }); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Scan initial + ré-scans tant que React monte le contenu
  var tries = 0;
  var iv = setInterval(function () { bindScroll(); tag(document); if (++tries > 16) clearInterval(iv); }, 200);

  var rootEl = document.getElementById("root") || document.body;
  var mo = new MutationObserver(function () { bindScroll(); scheduleScan(); });
  mo.observe(rootEl, { childList: true, subtree: true });

  if (document.readyState !== "loading") { tag(document); bindScroll(); }
  else document.addEventListener("DOMContentLoaded", function () { tag(document); bindScroll(); });
})();
