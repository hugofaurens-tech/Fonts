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

## Modifier le contenu

Presque tout se change dans **`js/data.js`** :

- `SITE` : nom, téléphone, e-mail, adresse, WhatsApp, Instagram, LinkedIn
- `BIENS` : les annonces (statut `vente` ou `vendu`, prix, surface, photo…). Chaque bien a un `id` unique qui sert d'adresse à sa page. Les champs détaillés (galerie `photos`, `description`, `pointsForts`, `equipements`, `quartierTexte`, charges…) sont facultatifs : une rubrique vide n'apparaît pas.
- `AVIS` : les avis clients (3 par page, les points de navigation s'ajoutent automatiquement)

Les photos des biens se placent dans `assets/img/`.

## Recevoir les formulaires par e-mail

1. Créez un formulaire gratuit sur [formspree.io](https://formspree.io).
2. Copiez l'adresse fournie (ex. `https://formspree.io/f/abcdwxyz`) dans `formEndpoint` de `js/data.js`.

Tant que `formEndpoint` est vide, les formulaires affichent la page de confirmation **sans rien envoyer**.

## Aperçu local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Polices

Crimson Pro (titres), Kumbh Sans (texte) et Montserrat (titres en capitales, boutons), hébergées dans `assets/fonts/`.
