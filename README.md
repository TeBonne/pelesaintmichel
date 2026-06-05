# Pèlerinage de Saint Michel — Site (Next.js + Supabase)

Page d'accueil **administrable** : le contenu est servi côté serveur (bon SEO) et
modifiable depuis une interface `/admin` protégée, sans toucher au code.

## Démarrer en local
```bash
npm install
npm run dev      # http://localhost:3000
```
Build de production : `npm run build && npm start`.

Variables d'environnement dans `.env.local` (déjà renseignées) :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clé *publishable*, lecture seule via RLS)

## Administration
1. **Créer le compte admin** (une seule fois) dans le tableau de bord Supabase :
   Authentication → Users → *Add user* → *Create new user*
   - E-mail : `antoine.bonnete@gmail.com` (déjà autorisé en base)
   - Mot de passe : au choix · cocher **Auto Confirm User**
2. (Optionnel, défense en profondeur) Authentication → Sign In/Providers → désactiver
   *Allow new users to sign up*.
3. Aller sur `/admin/login`, se connecter, modifier les sections, **Enregistrer**.
   Les changements apparaissent immédiatement sur le site.

## Rôles, éditeurs et journal
Deux rôles : **administrateur** (toi — édite le contenu *et* gère les droits, voit le journal)
et **éditeur** (édite uniquement le contenu).

Pour ajouter un éditeur :
1. Crée d'abord son compte dans Supabase (Authentication → Users → Add user, même e-mail).
2. Dans `/admin` → carte **« Éditeurs & droits »** : saisis son e-mail, choisis le rôle, « Autoriser ».
   (Tu peux aussi changer un rôle ou retirer un accès. Il reste toujours ≥ 1 administrateur.)

Le **journal d'activité** (carte en bas de `/admin`, visible par l'admin) enregistre les
**connexions**, les **modifications** (avec la section concernée) et la **gestion des droits**.

Réglages de sécurité Supabase recommandés (dashboard, optionnels) :
- Authentication → désactiver *Allow new users to sign up* (les comptes sont créés à la main).
- Authentication → activer *Leaked password protection*.

## Architecture
- `app/page.jsx` — page d'accueil (Server Component) : lit tout le contenu via
  `lib/queries.js` → `getHomeContent()`. ISR `revalidate = 3600` + `revalidatePath('/')`
  à chaque sauvegarde admin.
- `components/site/*` — sections (Hero, Chiffres, Programme, Citation, Videos, Faq,
  SiteHeader, SiteFooter, InscriptionForm). `components/ui/*` — primitives.
- `components/admin/*` + `app/admin/*` — interface d'édition (formulaires + Server Actions
  dans `app/admin/actions.js`).
- `lib/supabase/server.js` / `client.js` / `middleware.js` — clients `@supabase/ssr`.
- `app/globals.css` — design tokens (portés de `colors_and_type.css`) ; polices via `next/font`.

## Base de données (Supabase)
Tables de contenu : `hero`, `stats`, `programme_days`, `citation`, `videos`, `faq`,
`site_settings`. Sécurité : **lecture publique**, **écriture réservée** aux e-mails de
`admin_emails` (fonction `is_admin()`). Images uploadées dans le bucket Storage `homepage`.

## Pages du site (toutes administrables)
Chaque page a son éditeur dans `/admin` (hub → un éditeur par page) :
accueil, le-pelerinage, programme, prier, faq, ressources, boutique, nous-soutenir, recherche.
Modèle : 1 table singleton par page (`page_*` : héros, textes, CTA, SEO) + tables listes pour
les collections (cartes, partenaires, galerie `pele_*`, jours/temps/infos `prog_*`, `faq_page_items`,
`res_*`, `shop_products`, `soutenir_*`). Mêmes règles RLS (lecture publique / écriture membres).

## Inscription (lien externe)
L'inscription se fait sur une **app externe**. Renseigne son URL dans
`/admin/accueil` → « Réglages du site » → **Lien d'inscription**. Tous les boutons « S'inscrire »
et la bande d'appel à l'action de l'accueil pointeront automatiquement dessus.

## Champs SEO obligatoires
Chaque contenu référençable porte des champs SEO **obligatoires** : on ne peut pas enregistrer
tant qu'ils ne sont pas remplis (validation côté navigateur **et** côté serveur ; les champs
requis sont marqués d'un astérisque rouge dans l'admin).
- **Pages** : `Titre SEO` (meta_title) + `Description SEO` (meta_description), titre principal, image et son texte alternatif.
- **Images** (bandeaux, photos, logos, produits, jours du programme, galeries…) : `texte alternatif (alt)` obligatoire.
  Pour certaines images, le texte affiché sert d'alt (légende de galerie, nom de produit, nom de partenaire).
- **Listes** (chiffres, vidéos, FAQ, documents, newsletters, paliers de don, menu…) : leurs champs clés sont requis.

Des valeurs alt par défaut ont été pré-remplies pour tout le contenu existant ; à affiner via l'admin.

## Limites connues / suites possibles
- **Boutique** : catalogue d'affichage (titre, prix, description, photo). Pas de panier/paiement (prévu en externe).
- **Recherche** : bandeau éditable ; l'index des résultats est généré depuis les pages du site
  (à enrichir dans `components/page/SearchClient.jsx` si besoin).
- Les **liens de documents/newsletters** (page Ressources) pointent vers `#` par défaut : mettre les vraies URL via l'admin.
- Image de partage `public/partage-1200x630.jpg` à fournir pour l'aperçu réseaux sociaux.
