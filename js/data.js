/* ============================================================
   CONTENU DU SITE — c'est ce fichier qu'il faut modifier
   pour changer les coordonnées, les biens et les avis.
   ============================================================ */

const SITE = {
  nom: "Sébastien Faurens",
  sousTitre: "Agent immobilier Century 21",
  slogan: "Votre projet,<br>mon engagement.",
  description: "Sébastien Faurens, agent immobilier indépendant au sein de l’agence Century 21",
  agence: "Century 21 Patrimoine 17",
  adresse: ["60 rue des Batignolles", "75017 Paris"],
  telephone: "+33 6 65 62 10 91",
  email: "sebastien.faurens@century21.com",
  whatsapp: "33665621091", // numéro au format international, sans + ni espaces
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  copyright: "Sébastien Faurens — Agent commercial indépendant mandataire Century 21 Les Batignolles",

  // Adresse d'envoi des formulaires (ex. "https://formspree.io/f/xxxxxxx").
  // Laisser vide : les formulaires affichent la page de confirmation sans rien envoyer.
  formEndpoint: "",
};

/* ---------- Biens ----------
   statut : "vente" ou "vendu"
   type   : "appartement", "maison", "loft", "immeuble"…
   photo  : chemin de l'image dans assets/img/                    */
const BIENS = [
  {
    statut: "vente", type: "appartement",
    titre: "Style Haussmanien", ville: "Paris 17ème", quartier: "Batignolles",
    prix: 1350000, surface: 120, pieces: 4, dpe: "C",
    photo: "assets/img/bien-haussmannien.jpg",
  },
  {
    statut: "vente", type: "appartement",
    titre: "Duplex avec terrasse", ville: "Levallois-Perret", quartier: "Planchette",
    prix: 850000, surface: 95, pieces: 3, dpe: "B",
    photo: "assets/img/bien-duplex.jpg",
  },
  {
    statut: "vente", type: "appartement",
    titre: "Studio design", ville: "Paris 8ème", quartier: "Champs Elysées",
    prix: 450000, surface: 32, pieces: 1, dpe: "D",
    photo: "assets/img/bien-studio.jpg",
  },
  // Exemples de biens vendus (reprennent les visuels de la maquette — à remplacer)
  {
    statut: "vendu", type: "appartement",
    titre: "Style Haussmanien", ville: "Paris 17ème", quartier: "Batignolles",
    prix: 1350000, surface: 120, pieces: 4, dpe: "C",
    photo: "assets/img/bien-haussmannien.jpg",
  },
  {
    statut: "vendu", type: "appartement",
    titre: "Duplex avec terrasse", ville: "Levallois-Perret", quartier: "Planchette",
    prix: 850000, surface: 95, pieces: 3, dpe: "B",
    photo: "assets/img/bien-duplex.jpg",
  },
  {
    statut: "vendu", type: "appartement",
    titre: "Studio design", ville: "Paris 8ème", quartier: "Champs Elysées",
    prix: 450000, surface: 32, pieces: 1, dpe: "D",
    photo: "assets/img/bien-studio.jpg",
  },
];

/* ---------- Avis clients ---------- */
const AVIS = [
  {
    nom: "Marie-Claire T.", lieu: "Paris 17e",
    texte: "Sébastien a vendu notre appartement en moins de 3 semaines, au prix que nous souhaitions. Son calme et sa transparence tout au long du processus nous ont vraiment rassurés. On recommande sans hésitation.",
  },
  {
    nom: "François & Isabelle D.", lieu: "Levallois-Perret",
    texte: "Nous avions déjà tenté de vendre seuls pendant quatre mois sans succès. Sébastien a repositionné le prix, repris les photos et restructuré l'annonce. Résultat : deux offres en dix jours. On regrette de ne pas l'avoir appelé plus tôt.",
  },
  {
    nom: "Thomas & Camille B.", lieu: "Neuilly-sur-Seine",
    texte: "Nous cherchions depuis six mois sans trouver le bon bien. Sébastien a pris le temps de vraiment comprendre notre projet avant de nous proposer des visites. Il ne nous a pas fait perdre de temps avec des biens hors critères. On a trouvé notre appartement dès la troisième visite.",
  },
  {
    nom: "Natali.S", lieu: "Paris 17e",
    texte: "Estimation précise et accompagnement professionnel. Notre appartement s'est vendu au prix estimé en moins de 3 semaines.",
  },
];
