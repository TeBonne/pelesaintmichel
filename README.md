# UI Kit — Site web

Recréation haute-fidélité du site & des pages d'inscription du Pèlerinage de Saint Michel.

**Ouvrir `index.html`** — page d'accueil interactive : navigation ancrée, hero céleste, chiffres clés, programme en 3 jours, citation-thème, FAQ dépliable, formulaire d'inscription multi-étapes (branche / venue → identité → récapitulatif), footer.

### Composants (`*.jsx`)
- `ui.jsx` — primitives : `Logo`, `Overline`, `Button` (primary / gold / ghost / link), `PhotoSlot` (emplacement photo à remplacer), `Seal`, `GoldRule`.
- `chrome.jsx` — `SiteHeader` (nav translucide qui s'opacifie au défilement) et `SiteFooter`.
- `sections.jsx` — `Hero`, `Chiffres`, `Programme`, `Citation`, `FAQ`.
- `inscription.jsx` — `InscriptionForm` (3 étapes) + `Field`.

### À savoir
- Les images proviennent de la **photothèque de l'édition 2026** (`assets/photos/`) — hero, programme et citation utilisent de vraies photos via le composant `PhotoSlot` (prop `src`). Le placeholder doré reste disponible pour les emplacements sans photo.
- Couleurs, type et logo proviennent de `colors_and_type.css` et `assets/`.
- Maquette de démonstration : le formulaire ne soumet rien.
