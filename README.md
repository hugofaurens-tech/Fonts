# Site de Sébastien Faurens — Agent immobilier Century 21

Site vitrine statique (HTML / CSS / JavaScript, sans dépendance), reproduit d'après les maquettes.

## Pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `biens.html` / `biens-vendus.html` | Biens en vente / vendus (filtres + pagination) |
| `bien.html?id=…` | Page d'un bien (galerie, prix, caractéristiques, quartier, biens similaires) |
| `estimation.html` | Estimation en 4 étapes |
| `contact.html` | Formulaire de contact |
| `merci.html` | Confirmation après envoi d'un formulaire |

## Back-office (modifier le contenu)

Tout le contenu du site (textes, titres, images, biens, avis, coordonnées) est rangé dans le dossier
**`content/`** et se modifie depuis le back-office **[Pages CMS](https://app.pagescms.org)**, sans toucher au code.
Sa configuration est dans **`.pages.yml`**.

| Rubrique du back-office | Fichier |
|---|---|
| Biens immobiliers | `content/biens.json` |
| Avis clients | `content/avis.json` |
| Coordonnées et pied de page | `content/site.json` |
| Textes des pages (Accueil, Biens, Page d'un bien, Estimation, Contact, Confirmation) | `content/pages/*.json` |

### Mise en route (une seule fois)

1. Aller sur [app.pagescms.org](https://app.pagescms.org) et se connecter avec le compte GitHub propriétaire du dépôt.
2. Installer l'application **Pages CMS** sur le dépôt `Fonts` quand c'est demandé.
3. Ouvrir le dépôt et choisir **la même branche que celle publiée par GitHub Pages**.
4. Dans **Settings → Collaborators**, inviter l'agent par son adresse e-mail : il recevra un lien de connexion,
   sans avoir besoin de compte GitHub.

### Au quotidien

- Chaque **Save** enregistre la modification dans le dépôt ; le site en ligne est mis à jour en 1 à 2 minutes.
- Images : les photos vont dans `assets/img/`, les icônes dans `assets/icons/`. Préférer des photos de moins de 1 Mo
  (format JPG, environ 1600 px de large).
- Dans les champs de texte, un retour à la ligne crée un retour à la ligne sur le site ; une ligne vide crée un
  nouveau paragraphe (descriptions de biens et du quartier).
- Chaque bien a un **identifiant** unique (ex. `duplex-terrasse`) qui forme l'adresse de sa page `bien.html?id=…`.

Restent dans le code : le menu, les libellés des champs de formulaire et la mise en page.

## Recevoir les formulaires par e-mail

1. Créez un formulaire gratuit sur [formspree.io](https://formspree.io).
2. Collez l'adresse fournie (ex. `https://formspree.io/f/abcdwxyz`) dans le back-office : **Coordonnées et pied de page → Adresse d'envoi des formulaires**.

Tant que `formEndpoint` est vide, les formulaires affichent la page de confirmation **sans rien envoyer**.

## Cookies

Un bandeau (`js/cookies.js`) demande le consentement à la première visite : « Tout accepter », « Tout refuser »
ou « Personnaliser ». Le choix est mémorisé 6 mois (cookie `sf_consentement`) et peut être modifié à tout moment
via le lien **Gestion des cookies** du pied de page.

Pour activer une mesure d'audience, renseigner l'identifiant Google Analytics (`G-…`) dans le back-office :
**Coordonnées et pied de page → Bandeau cookies**. Le script n'est chargé qu'après accord du visiteur.

## Aperçu local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Le contenu étant chargé depuis `content/`, le site doit être servi par un serveur (GitHub Pages ou la commande ci-dessus) :
ouvrir directement `index.html` en double-cliquant n'affichera pas les textes.

## Polices

Crimson Pro (titres), Kumbh Sans (texte) et Montserrat (titres en capitales, boutons), hébergées dans `assets/fonts/`.
