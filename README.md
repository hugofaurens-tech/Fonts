# Horizon Immobilier — site vitrine d'agent immobilier

Site statique (HTML / CSS / JavaScript, sans dépendance) qui utilise les polices **Horizon** et **Horizon Outlined** du dépôt.

## Aperçu local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Contenu

- **Accueil** : accroche, moteur de recherche (type, transaction, budget) et chiffres clés animés
- **Biens** : annonces filtrables, avec une fiche détaillée en fenêtre modale et un bouton « Demander une visite » qui pré-remplit le formulaire de contact
- **Services** : vente, achat, estimation et gestion locative
- **À propos** : présentation de l'agent
- **Avis clients** : carrousel automatique
- **Estimation** : calculateur de fourchette de prix indicative
- **Contact** : coordonnées et formulaire avec validation

## Personnalisation

| À modifier | Où |
|---|---|
| Annonces (prix, photos, descriptions) | tableau `PROPERTIES` dans `js/main.js` |
| Nom, textes, coordonnées, n° de carte pro | `index.html` |
| Couleurs et polices | variables `:root` dans `css/style.css` |
| Prix au m² du calculateur | attributs `value` du champ « Secteur » dans `index.html` |
| Envoi réel du formulaire | gestionnaire `#contactForm` dans `js/main.js` (Formspree, Netlify Forms…) |

> Le nom de l'agent, les annonces, les avis et les coordonnées sont des exemples fictifs à remplacer.
> Les photos proviennent d'Unsplash (chargées en ligne).
