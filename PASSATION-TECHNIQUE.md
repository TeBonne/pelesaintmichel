# Passation technique — Site web Pèlerinage de Saint Michel

Checklist SEO, sécurité et qualité de code pour le passage de la **maquette** (prototype HTML rendu côté navigateur) au **site de production**.

> La maquette `ui_kits/site_web/` est une recréation visuelle haute-fidélité. Les points marqués ✅ y sont déjà en place ; les points ⛔ relèvent de l'infrastructure du site final.

---

## 1. SEO

### ✅ Déjà en place (dans `index.html`)
- `<title>` optimisé, **meta description**, `robots`, **canonical**
- **Open Graph** + **Twitter Card**
- Données structurées **JSON-LD `Event`** (dates) et **`FAQPage`**
- `theme-color`, `lang="fr"`, **preconnect** vers Google Fonts
- Navigation en **vrais `<a href>`** (crawlables), un seul `<h1>`, `alt` sur le hero

### ⛔ À implémenter en production
1. **Rendu côté serveur ou pré-généré (SSR/SSG)** — *priorité absolue*.
   Aujourd'hui le contenu est rendu par React **dans le navigateur** : un robot ne voit qu'un `<div id="root">` vide. Solution : Next.js / Astro / Remix, ou l'export statique du CMS, pour que le HTML livré contienne déjà textes et balises.
2. **`sitemap.xml`** + **`robots.txt`** (référencer le sitemap).
3. **Image de partage 1200×630** dédiée → mettre à jour `og:image` avec une URL **absolue**.
4. **URLs propres et uniques par page** (`/programme`, `/inscription`, `/faq`…), chacune avec son `<title>`/description.
5. **Performance (Core Web Vitals)** : compresser les photos (**WebP** + tailles responsives + `loading="lazy"` hors hero), auto-héberger les polices ou `preload` les essentielles, supprimer Babel-navigateur.

---

## 2. Sécurité

### ✅ Déjà en place
- Scripts CDN avec **Subresource Integrity** (`integrity`) + `crossorigin`
- `rel="noopener noreferrer"` sur les liens sortants

### ⛔ À implémenter en production (côté serveur/hébergeur)
1. **HTTPS partout** + **HSTS** (`Strict-Transport-Security`).
2. **Content-Security-Policy** restrictive (limiter `script-src`, `style-src`, `img-src`).
3. En-têtes : `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options`/`frame-ancestors`.
4. **Formulaire d'inscription** : validation **côté serveur**, protection anti-spam (honeypot/captcha), **limitation de débit**, protection CSRF, et **ne pas exposer l'e-mail en clair** (passer par un formulaire).
5. **RGPD** : bannière cookies si analytics, mentions légales, politique de confidentialité.

---

## 3. Qualité de code

### ✅ Déjà en place
- HTML sémantique (`<header>`, `<main>`, `<nav aria-label>`, `<footer>`)
- **Accessibilité** : skip link, `aria-current="page"`, focus visible doré, `aria-label` sur les icônes réseaux

### ⛔ À faire en production
1. **Build compilé** (Vite/Next) — retirer `@babel/standalone` et `react.development.js` → `react.production.min`.
2. **Tests** : Lighthouse (SEO/perf/a11y ≥ 90), validation W3C, axe-core pour l'accessibilité.
3. **Contraste** : réserver l'or `#C9A45E` aux titres / gros texte (limite en petit corps sur fond clair).
4. **Navigation responsive** : menu « burger » sous ~1024 px (la barre actuelle est dense sur petit écran).

---

## 4. Réseaux sociaux — à brancher

Les liens sont des **placeholders** dans `ui_kits/site_web/chrome.jsx` (composant `SocialIcons`). Remplacer les URL :

```js
const items = [
  ["Instagram", "https://instagram.com/VOTRE_COMPTE", …],
  ["Facebook",  "https://facebook.com/VOTRE_COMPTE", …],
  ["YouTube",   "https://youtube.com/@VOTRE_CHAINE", …],
];
```

> Donnez-moi les comptes officiels et je les branche directement.

---

## 5. Priorisation recommandée
1. **SSR/SSG** (débloque tout le SEO de contenu).
2. HTTPS + en-têtes de sécurité.
3. sitemap/robots + image de partage.
4. Sécurité du formulaire d'inscription.
5. Performance images + build de production.
6. Menu responsive + audit Lighthouse final.
